import { ArticleEntity } from '@app/article/article.entity';

export type ArticleType = Omit<ArticleEntity, 'updateTimeStamp'>;
// создаем тип данных, но без поля "updateTimeStamp", т.к. наша обертка не принимает функции.
