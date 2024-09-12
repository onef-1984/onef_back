import { ApiProperty } from '@nestjs/swagger';

class ItemDto {
  @ApiProperty({
    description: 'The ISBN-13 of the book',
    example: '978-3-16-148410-0',
  })
  isbn13: string;

  @ApiProperty({
    description: 'The title of the book',
    example: 'The Great Book',
  })
  title: string;

  @ApiProperty({
    description: 'The author of the book',
    example: 'John Doe',
  })
  author: string;

  @ApiProperty({
    description: 'The publication date of the book',
    example: '2024-09-11',
  })
  pubDate: string;

  @ApiProperty({
    description: 'A brief description of the book',
    example: 'An insightful book about the great mysteries of the universe.',
  })
  description: string;

  @ApiProperty({
    description: 'The URL of the book cover image',
    example: 'https://example.com/cover.jpg',
  })
  cover: string;

  @ApiProperty({
    description: 'The category ID of the book',
    example: 1,
  })
  categoryId: number;

  @ApiProperty({
    description: 'The name of the category of the book',
    example: 'Science Fiction',
  })
  categoryName: string;

  @ApiProperty({
    description: 'The publisher of the book',
    example: 'Example Publisher',
  })
  publisher: string;

  @ApiProperty({
    description: 'The customer review rank of the book',
    example: 4.5,
  })
  customerReviewRank: number;
}

export class PaginatedItemsDto {
  @ApiProperty({
    description: 'Indicates if there are more items to fetch',
    example: true,
  })
  hasNext: boolean;

  @ApiProperty({
    description: 'Array of items',
    type: [ItemDto],
  })
  items: ItemDto[];
}
