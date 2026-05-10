import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { mapProduct } from '../../common/mappers';
import { Category } from '../../entities/category.entity';
import { PriceTag } from '../../entities/price-tag.entity';
import { Product } from '../../entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

interface ProductQuery {
  keyword?: string;
  page?: string;
  pageSize?: string;
  categories?: string;
}

@Injectable()
export class AdminProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @InjectRepository(PriceTag)
    private readonly priceTagsRepository: Repository<PriceTag>,
  ) {}

  async list(query: ProductQuery) {
    const page = Number(query.page ?? 0) || 0;
    const pageSize = Number(query.pageSize ?? 10) || 10;

    const qb = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.priceTags', 'priceTags')
      .leftJoinAndSelect('product.categories', 'categories')
      .orderBy('product.createdAt', 'DESC')
      .skip(page * pageSize)
      .take(pageSize);

    if (query.keyword) {
      qb.andWhere('LOWER(product.name) LIKE :keyword', {
        keyword: `%${query.keyword.toLowerCase()}%`,
      });
    }

    if (query.categories) {
      const ids = JSON.parse(query.categories || '[]');
      if (ids.length > 0) {
        qb.andWhere('categories.id IN (:...ids)', { ids });
      }
    }

    const [products, total] = await qb.getManyAndCount();

    return {
      meta: { page, pageSize, total },
      data: products.map(mapProduct),
    };
  }

  async findOne(id: string) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: { priceTags: true, categories: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return mapProduct(product);
  }

async create(payload: CreateProductDto) {
  const categories = payload.categories?.length
    ? await this.categoriesRepository.find({
        where: { id: In(payload.categories) },
      })
    : [];

  const product = this.productsRepository.create({
    name: payload.name,
    description: payload.description,
    images: payload.images ?? [],
    sizes: payload.sizes ?? [],
    colors: payload.colors ?? [],
    categories,
    isFeatured: payload.isFeatured ?? false,
    hasDiscount: payload.hasDiscount ?? false,
    season: payload.season,
  });

  const savedProduct = await this.productsRepository.save(product);

  if (payload.priceTags?.length) {
    const priceTags = payload.priceTags.map((tag) =>
      this.priceTagsRepository.create({
        name: tag.name,
        price: tag.price,
        product: savedProduct,
      }),
    );
    // ✅ احفظ الـ priceTags
    await this.priceTagsRepository.save(priceTags);
  }

  return this.findOne(savedProduct.id);
}
  async update(id: string, payload: UpdateProductDto) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: { priceTags: true, categories: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (payload.name !== undefined) product.name = payload.name;
    if (payload.description !== undefined) product.description = payload.description;
    if (payload.images !== undefined) product.images = payload.images;
    if (payload.sizes !== undefined) product.sizes = payload.sizes;
    if (payload.colors !== undefined) product.colors = payload.colors;
    if (payload.isFeatured !== undefined) product.isFeatured = payload.isFeatured;
    if (payload.hasDiscount !== undefined) product.hasDiscount = payload.hasDiscount;
    if (payload.season !== undefined) product.season = payload.season;

    if (payload.categories !== undefined) {
      product.categories = payload.categories.length
        ? await this.categoriesRepository.find({
            where: { id: In(payload.categories) },
          })
        : [];
    }

    if (payload.priceTags !== undefined) {
      await this.priceTagsRepository.delete({ product: { id: product.id } });
      product.priceTags = payload.priceTags.length
        ? payload.priceTags.map((tag) =>
            this.priceTagsRepository.create({
              name: tag.name,
              price: tag.price,
              product,
            }),
          )
        : [];
    }

    await this.productsRepository.save(product);
    return this.findOne(id);
  }

  async remove(id: string) {
    const product = await this.productsRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.productsRepository.remove(product);
    return { success: true };
  }
}