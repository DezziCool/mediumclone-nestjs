import { UserEntity } from '@app/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, getRepository, Repository } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { CreateArticleDto } from './dto/createArticle.dto';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import slugify from 'slugify';
import { UpdateArticleDto } from './dto/updateArticle.dto';
import { ArticlesResponseInterface } from './types/articlesResponse.interface';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(
    currentUserId: number,
    query: any,
  ): Promise<ArticlesResponseInterface> {
    const queryBilder = getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author');

    queryBilder.orderBy('articles.createdAt', 'DESC');

    const articlesCount = await queryBilder.getCount(); // возвращает общее кол-во записей в нашем запросе

    if (query.tag) {
      queryBilder.andWhere('articles.tagList LIKE :tag', {
        tag: `%${query.tag}%`,
      });
    }

    if (query.author) {
      // получаем автора по нашему username
      const author = await this.userRepository.findOne({
        username: query.author,
      });
      // andWhere - добавляет логику к запросу
      // :id - место, куда вставится наша переменная
      queryBilder.andWhere('articles.authorId = :id', {
        id: author.id,
      });
    }

    if (query.limit) {
      queryBilder.limit(query.limit);
    }
    if (query.offset) {
      queryBilder.offset(query.offset); // указывает сколько кол-во строк требуется пропустить перед тем как начать искать
    }
    // if (query.limit) {
    //   queryBilder.limit(query.limit);
    // }

    const articles = await queryBilder.getMany(); // вернет массив articles из нашего запроса queryBilder

    return { articles, articlesCount };
  }

  async createArticle(
    currentUser: UserEntity,
    createArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const article = new ArticleEntity();
    Object.assign(article, createArticleDto);

    if (!article.tagList) {
      article.tagList = [];
    }

    article.slug = this.getSlug(createArticleDto.title);
    article.author = currentUser;

    return await this.articleRepository.save(article);
  }

  async findBySlug(
    slug: string,
    currentUserId?: number,
  ): Promise<ArticleEntity> {
    const article = await this.articleRepository.findOne({ slug });
    if (!article) {
      throw new HttpException('slug no response', HttpStatus.NOT_FOUND);
    }
    if (currentUserId && currentUserId != article.author.id) {
      throw new HttpException('You are not an author', HttpStatus.NOT_FOUND);
    }

    return article;
  }

  async deleteArticle(
    slug: string,
    currentUserId: number,
  ): Promise<DeleteResult> {
    await this.findBySlug(slug, currentUserId);

    return await this.articleRepository.delete({ slug });
  }

  async updateArticle(
    slug: string,
    currentUserId: number,
    updateArticleDto: UpdateArticleDto,
  ) {
    const article = await this.findBySlug(slug, currentUserId);
    Object.assign(article, updateArticleDto);
    return await this.articleRepository.save(article);
  }

  buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
    return { article };
  }

  private getSlug(title: string): string {
    return (
      slugify(title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }
}
