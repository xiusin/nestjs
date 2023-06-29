import { Body, Controller, Get, HttpStatus, Inject, Param, ParseIntPipe, Post, Put, Query, Redirect, Req, UsePipes, ValidationPipe } from '@nestjs/common';

import { Request } from '@nestjs/common';
import { CreateCatDto } from 'src/dto/create-cat.dto';
import { UpdateCatDto } from 'src/dto/update-cat.dto';
import { Cat } from 'src/interfaces/cats.interface';
import { CatsService } from './cats.service';

@Controller('cats')
export class CatsController {

    @Inject() 
    // 注入指定类型的服务，目前测试看来是共享单例, 如果是泛型一般需要使用@Inject('xxx')
    // 官方建议使用构造函数方法注入，而不是通过属性注解注入
    private readonly cats: CatsService;


    // 在构造函数内注入service, 官方文档说要使用private
    // The CatsService is injected through the class constructor. Notice the use of the private syntax. This shorthand allows us to both declare and initialize the catsService member immediately in the same location.
    constructor(private catsService: CatsService) {}
    
    // 下面意思为：
    //    httpClient需要注入一个可选的服务HTTP_OPTIONS
    //    因为T为泛型，所有无法推导
    // constructor(@Optional() @Inject('HTTP_OPTIONS') private httpClient: T) {}



    @Get()
    findAll(): Cat[] {
        console.log(this.cats == this.catsService);
        return this.catsService.findAll();
    }


    @Post()
    // @UsePipes(new ValidationPipe) // 使用管道过滤验证数据
    create(@Body() createCatDto: CreateCatDto): string {
        this.catsService.create(createCatDto)
        return "success";
    }

    @Put()
    put(@Body() updateCatDto: UpdateCatDto) {
        
    }


    @Get("/find-one") 
    // 使用pipe调用注入参数
    findOne(@Query('id', ParseIntPipe) id: number = 0): string {
        console.log('id', typeof id);
        return "this action return a cat: " + id;
    }

    /**
     * 注入请求对象
     */
    @Get("delete-one/:id")
    deleteOne(
        @Req() request: Request, 
        @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE})) id: number = 0 // 应用pipe且定义错误时状态码
    ) {
        return request.url + ' delete id = ' + id;
    }

    @Get('/redirect')
    @Redirect('http://www.baidu.com', 302) // 会覆盖所有的处理直接跳转链接
    redirectToBaidu() {
        return { url: 'http://www.baidu.com', title: '百度' }
    }
}
