import {
  Resolver,
  Query,
  Args,
  Mutation,
  Field,
  InputType,
  Context,
} from '@nestjs/graphql';

import { PrismaService } from 'src/prisma/prisma.service';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Book } from './book.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from '@prisma/client';

@InputType()
class BookInput {
  @Field()
  @IsNotEmpty()
  isbn13!: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  title: string;
}

@Resolver()
export class BookResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => Book)
  async getBook(@Args('isbn13') isbn13: string) {
    return this.prisma.book.findUnique({
      where: { isbn13 },
      include: { subInfo: true },
    });
  }

  @Query(() => [Book])
  async getBooks(
    @Args({ name: 'isbn13s', type: () => [String] }) isbn13s: Array<string>,
  ) {
    return await this.prisma.book.findMany({
      where: { isbn13: { in: isbn13s } },
      include: { subInfo: true },
    });
  }

  @Mutation(() => Book)
  @UseGuards(AuthGuard)
  async patchBook(
    @Args({ name: 'input', type: () => BookInput })
    { isbn13, title }: BookInput,
    @Context('req') { user }: { user: User },
  ) {
    console.log(user);

    return this.prisma.book.update({
      where: { isbn13 },
      data: { title },
      include: { subInfo: true },
    });
  }
}
