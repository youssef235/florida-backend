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
    const qb = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'categories')
      .leftJoinAndSelect('product.priceTags', 'priceTags');

    // =========================
    // 1. Search
    // =========================
    if (query.keyword) {
      qb.andWhere('LOWER(product.name) LIKE :keyword', {
        keyword: `%${query.keyword.toLowerCase()}%`,
      });
    }

    // =========================
    // 2. Category Filter (FIXED)
    // =========================
    if (query.category && query.category !== 'all') {
      qb.innerJoin('product.categories', 'filterCategory')
        .andWhere('filterCategory.name = :catName', {
          catName: query.category,
        });
    }

    // =========================
    // 3. Discount Filter
    // =========================
    if (query.hasDiscount === 'true') {
      qb.andWhere('product.hasDiscount = :hasDiscount', {
        hasDiscount: true,
      });
    }

    // =========================
    // 4. Price Filter
    // =========================
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

    // =========================
    // 5. Sorting (FIXED)
    // =========================
    const sortMap: Record<string, string> = {
      'price-asc': 'priceTags.price',
      'price-desc': 'priceTags.price',
      popularity: 'product.isFeatured',
      default: 'product.createdAt',
    };

    const sort = query.sort || 'default';
    const sortField = sortMap[sort] || sortMap.default;

    const sortOrder =
      sort === 'price-desc' || sort === 'default' ? 'DESC' : 'ASC';

    qb.orderBy(sortField, sortOrder);

    // =========================
    // 6. Pagination (FIXED)
    // =========================
    const page = Math.max(1, Number(query.page) || 1);
    const pageSize = Math.max(1, Number(query.pageSize) || 12);

    qb.skip((page - 1) * pageSize).take(pageSize);

    // =========================
    // 7. Execute
    // =========================
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