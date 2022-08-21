import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { User } from './user.model';
import { UsersService } from './users.service';
import { v4 as uuidv4 } from 'uuid'
import path = require('path')
import { Observable, of } from 'rxjs';

export const storage = {
    storage: diskStorage({
        destination: './uploads/profileimages',
        filename: (req, file, cb) => {
            const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
            const extension: string = path.parse(file.originalname).ext;

            cb(null, `${filename}${extension}`);
        }
    })
}


@Controller('users')
@ApiTags('users')
export class UsersController {
    constructor(private userService: UsersService) {}
    @Get()
    findAll(): Promise<User[]> {
        return this.userService.findAll();
    }
    @Post()
    create(@Body() user: User): Promise<User> {
        return this.userService.create(user);
    }
    @Put(':id')
    @ApiParam({ name: 'id'})
    update(@Param() params, @Body() user: User): Promise<User> {
        return this.userService.update(params.id, user);
    }
    @Delete(':id')
    @ApiParam({ name: 'id'})
    destroy(@Param() params): Promise<User> {
        return this.userService.destroy(params.id);
    }
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', storage))
    uploadFile(@UploadedFile() file): Observable<Object> {
        console.log(file);
        return of({ imagePath: file.filename})
    }
}
