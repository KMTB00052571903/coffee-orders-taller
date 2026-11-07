/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Type } from "class-transformer";
import { IsIn, IsInt, IsOptional, Min, Max, IsString } from "class-validator";

export class FilterOrderQueryDto {
  @IsString()
  @IsOptional()
  @IsIn(["pending", "ready"])
  status!: "pending" | "ready";

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  limit: number = 5;

  @IsIn(["ASC", "DESC"])
  sortOrder: "ASC" | "DESC" = "ASC";
}
