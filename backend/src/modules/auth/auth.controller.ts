import { Controller, Post, Body, Get, UseGuards, Req, Headers, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { AdminGuard } from './guards/admin.guard';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Auth')
@Controller('admin')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Admin login' })
  @ApiResponse({ status: 200, description: 'Login successful', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    const admin = await this.authService.validateAdmin(loginDto.username, loginDto.password);
    return this.authService.login(admin);
  }

  @UseGuards(AdminGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get admin profile' })
  async getProfile(@Req() req: any) {
    return this.authService.getAdminProfile(req.user.id);
  }

  @UseGuards(AdminGuard)
  @Post('verify')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify JWT token' })
  async verifyToken(@Headers('authorization') authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Invalid token format');
    }
    const payload = await this.authService.verifyToken(token);
    return { valid: true, payload };
  }

  @UseGuards(AdminGuard)
  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin logout' })
  async logout() {
    return { message: 'Logout successful. Please remove token from client storage.' };
  }
}