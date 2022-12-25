// ** Nest Imports
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// ** Dto, Entity, Repo Imports
import { User } from '../domain/user.entity';
import { RequestUserSaveDto } from '../dto/user.request.save.dto';
import { RequestUserLoginDto } from '../dto/user.request.login.dto';
import { UserRepository } from '../infrastructure/user.repository';

// ** Library Imports
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  // ** 유저 저장
  async localUserSave(body: RequestUserSaveDto) {
    try {
      const findId = await this.findUserById(body.id);
      if (findId)
        throw new HttpException('이미 존재 하는 계정', HttpStatus.BAD_REQUEST);
      const hash: string = await this.hashPassword(body.password);
      const saveUser: User = this.userRepository.create({
        id: body.id,
        password: hash,
        name: body.name,
      });
      return await this.userRepository.save(saveUser);
    } catch (err) {
      console.log(err);
      throw new HttpException('BAD REQUEST', HttpStatus.BAD_REQUEST);
    }
  }

  // ** 유저 로그인
  async localUserLogin(body: RequestUserLoginDto): Promise<User> {
    try {
      const findUser: User = await this.userRepository.findOne({
        where: { id: body.id },
      });
      if (!findUser)
        throw new HttpException('ID를 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
      const compareResult: boolean = await this.compareHash(
        body.password,
        findUser.password,
      );
      return compareResult ? findUser : null;
    } catch (err) {
      throw new HttpException('BAD REQUEST', HttpStatus.BAD_REQUEST);
    }
  }

  // ** Utils : ID로 User 조회
  async findUserById(id: string) {
    try {
      return await this.userRepository.findOne({ where: { id } });
    } catch (err) {
      console.log(err);
      throw new HttpException('BAD REQUEST', HttpStatus.BAD_REQUEST);
    }
  }
  // ** Utils : Password 암호화
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, +process.env.HASH_KEYWORD);
  }

  // ** Utils : JWT 발급
  async gwtJwtWithIdx(idx: number) {
    return this.jwtService.sign({ idx });
  }

  // ** Utils : IDX로 User 조회
  async getUserByIdx(idx: number) {
    return await this.userRepository.findOne({ where: { idx } });
  }

  // ** Utils : Password 암호 풀기
  async compareHash(password: string, hash: string): Promise<boolean> {
    const result = await bcrypt.compare(password, hash);
    if (!result) throw new HttpException('BAD REQUEST', HttpStatus.BAD_REQUEST);
    return result;
  }
}
