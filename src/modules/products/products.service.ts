import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../entities/product.entity';
import { mapProduct } from '../../common/mappers';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

async getProducts(query: Record<string, any>) {
  const page = Math.max(1, Number(query.page) || 1);
  const pageSize = Math.max(1, Number(query.pageSize) || 12);

  const qb = this.productsRepository
    .createQueryBuilder('product')
    .leftJoinAndSelect('product.categories', 'categories')
    .leftJoinAndSelect('product.priceTags', 'priceTags');

  // =========================
  // SEARCH
  // =========================
  if (query.keyword) {
    qb.andWhere('LOWER(product.name) LIKE :keyword', {
      keyword: `%${query.keyword.toLowerCase()}%`,
    });
  }

  // =========================
  // CATEGORY FILTER (SAFE)
  // =========================
  if (query.category && query.category !== 'all') {
    qb.andWhere('categories.name = :category', {
      category: query.category,
    });
  }

  // =========================
  // DISCOUNT FILTER
  // =========================
  if (query.hasDiscount === 'true') {
    qb.andWhere('product.hasDiscount = :hasDiscount', {
      hasDiscount: true,
    });
  }

  // =========================
  // PRICE FILTER (SAFE FIX)
  // =========================
  if (query.minPrice || query.maxPrice) {
    qb.andWhere('priceTags.price IS NOT NULL');

    if (query.minPrice) {
      qb.andWhere('priceTags.price >= :minPrice', {
        minPrice: Number(query.minPrice),
      });
    }

    if (query.maxPrice) {
      qb.andWhere('priceTags.price <= :maxPrice', {
        maxPrice: Number(query.maxPrice),
      });
    }
  }

  // =========================
  // SORTING SAFE
  // =========================
  const sort = query.sort || 'default';

  if (sort === 'price-asc') {
    qb.orderBy('priceTags.price', 'ASC');
  } else if (sort === 'price-desc') {
    qb.orderBy('priceTags.price', 'DESC');
  } else if (sort === 'popularity') {
    qb.orderBy('product.isFeatured', 'DESC');
  } else {
    qb.orderBy('product.createdAt', 'DESC');
  }

  // =========================
  // PAGINATION
  // =========================
  qb.skip((page - 1) * pageSize).take(pageSize);

  const [products, total] = await qb.getManyAndCount();

  return {
    data: products.map(mapProduct),
    meta: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}
  async getProductById(id: string) {
    const product = await this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'categories')
      .leftJoinAndSelect('product.priceTags', 'priceTags')
      .where('product.id = :id', { id })
      .getOne();

    return product ? mapProduct(product) : null;
  }
}