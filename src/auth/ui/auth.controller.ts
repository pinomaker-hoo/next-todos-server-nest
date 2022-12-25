// ** Nest Imports
import { Body, Controller, Post, Res } from '@nestjs/common';

// ** Service Imports
import { AuthService } from '../application/auth.service';

// ** Node Imports
import { Response } from 'express';

// ** Dto Imports
import { RequestUserSaveDto } from '../dto/user.request.save.dto';
import { RequestUserLoginDto } from '../dto/user.request.login.dto';

@Controller('auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/')
  async localUserSave(@Body() body: RequestUserSaveDto) {
    return this.authService.localUserSave(body);
  }

  @Post('/login')
  async localUserLogin(
    @Body() body: RequestUserLoginDto,
    @Res() res: Response,
  ) {
    const loginUser = await this.authService.localUserLogin(body);
    const token = await this.authService.gwtJwtWithIdx(loginUser.idx);
    res.cookie('accessToken', token, {
      expires: new Date(Date.now() + 86400e3),
    });
    return res.redirect('http://localhost:3000');
  }
}
