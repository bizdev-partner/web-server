import { Controller, Get, Post, Body } from '@nestjs/common';

interface ILoginAttempt {
    username: string,
    password: string
}

@Controller()
export class AppController {
  constructor() { }

  @Get("hc")
  async healthCheck(): Promise<string> {
    return new Promise(resolve => {
      resolve("Healthy")
    });
  }

  @Post("login")
  async login(@Body() attempt: ILoginAttempt): Promise<boolean> {
    return new Promise(resolve => {
      resolve(attempt.username == "bizdev" && attempt.password == "RevenuePartner")
    });
  }
}
