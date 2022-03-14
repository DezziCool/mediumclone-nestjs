export class UpdateArticleDto {
  readonly title?: string;

  readonly description?: string;

  readonly body?: string;

  readonly taglist?: Array<string>;
}
