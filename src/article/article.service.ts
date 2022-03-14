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

    if (query.favorited) {
      const author = await this.userRepository.findOne(
        {
          username: query.favorited,
        },
        { relations: ['favorites'] },
      );
      const ids = author.favorites.map((el) => el.id);
      // проверяем у каждого "article" поле "id" и проверяем что этот "id" находится в массиве "ids"
      // но если "ids" будет пустым - typeorm ломается
      if (ids.length > 0) {
        queryBilder.andWhere('articles.id IN (:...ids)', { ids });
      } else {
        queryBilder.andWhere('1=0'); // просто создали для того, чтобы оборвать наш queryBilder. Иначе он вернет все наши посты
      }
    }

    if (query.limit) {
      queryBilder.limit(query.limit);
    }
    if (query.offset) {
      queryBilder.offset(query.offset); // указывает сколько кол-во строк требуется пропустить перед тем как начать искать
    }

    // если м не залогинены "favoriteIds" всегда будет пустой
    let favoriteIds: number[] = [];

    if (currentUserId) {
      // currentUser - это "UserEntity" с "favorites".
      const currentUser = await this.userRepository.findOne(currentUserId, {
        relations: ['favorites'],
      });
      // записываем массив "articles", который залайкнуты
      favoriteIds = currentUser.favorites.map((favorite) => favorite.id);
    }

    const articles = await queryBilder.getMany(); // вернет массив articles из нашего запроса queryBilder
    const articlesWithFavorites = articles.map((article) => {
      const favorited = favoriteIds.includes(article.id);
      return { ...article, favorited };
    });

    return { articles: articlesWithFavorites, articlesCount };
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

  async addArticleToFavorites(
    slug: string,
    currentUserId: number,
  ): Promise<ArticleEntity> {
    // user.favorites.push(article)
    const article = await this.findBySlug(slug, currentUserId);
    const user = await this.userRepository.findOne(currentUserId, {
      relations: ['favorites'],
    });
    // ищем индекс в элементе массива - убедиться что значение = "-1", т.е. его нет в массиве
    const isNotFavorited =
      user.favorites.findIndex(
        (articleInFavorites) => articleInFavorites.id === article.id,
      ) === -1; // переводим полученнное значение в тип "boolen"
    console.log('isNotFavorited add - ', isNotFavorited);
    //если не залайкнут пост - лайкаем
    if (isNotFavorited) {
      user.favorites.push(article);
      article.favoritesCount++;
      // сохраняем изменения
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
      console.log('save like');
    }
    return article;
  }

  async deleteArticleFromFavorites(
    slug: string,
    currentUserId: number,
  ): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug, currentUserId);
    const user = await this.userRepository.findOne(currentUserId, {
      relations: ['favorites'],
    });
    // ищем индекс в элементе массива - убедиться что значение = "-1", т.е. его нет в массиве
    const articleIndex = user.favorites.findIndex(
      (articleInFavorites) => articleInFavorites.id === article.id,
    );
    console.log('articleIndex del - ', articleIndex);

    if (articleIndex >= 0) {
      user.favorites.splice(articleIndex, 1); // меняем этот же массив; удаляет наш лайк из массива "favorites"
      article.favoritesCount--;
      // сохраняем изменения
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
      console.log('delete like');
    }

    return article;
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
