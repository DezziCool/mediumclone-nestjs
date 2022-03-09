import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  if (!request.user) {
    return null;
  }

  if (data) {
    return request.user[data];
  }

  return request.user; // в случае не выполнения наших условий - вернуть всего пользователя
});

// идея декоратооора в том, что он просто возвращает какое то значние
// мы могли бы все тоже самое написать в контроллере, но мы не хотим дублировать этот код каждый раз в каждом месте где нам нужен currentUser()
// мы хотим исопльзовать в удобном виде и кастомные декораторы в этом нам помогают
