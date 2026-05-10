import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { UserRole } from '../../../common/enums/user-role.enum';

export class UpdateUserRoleDto {
  @ApiProperty({
    example: 'ADMIN',
    enum: UserRole,
    description: 'الدور الجديد للمستخدم',
  })
  @IsIn([UserRole.ADMIN, UserRole.CUSTOMER])
  role!: UserRole;
}