import { User } from '@app/user/decorators/user.decorators';
import { AuthGuard } from '@app/user/guards/auth.guard';
import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileResponseInterface } from './types/porifleResponse.interface';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':username')
  async getProfileUser(
    @User('id') currentUserId: number,
    @Param('username') profileUsername: string,
  ): Promise<ProfileResponseInterface> {
    const user = await this.profileService.findByUsername(
      profileUsername,
      currentUserId,
    );
    return this.profileService.buildProfileResponse(user);
  }

  @Post(':username/follow')
  @UseGuards(AuthGuard)
  async followProfile(
    @User('id') currentUserId: number,
    @Param('username') profileUsername: string,
  ): Promise<ProfileResponseInterface> {
    const user = await this.profileService.followProfile(
      profileUsername,
      currentUserId,
    );
    return this.profileService.buildProfileResponse(user);
  }

  @Delete(':username/follow')
  @UseGuards(AuthGuard)
  async unfollowProfile(
    @User('id') currentUserId: number,
    @Param('username') profileUsername: string,
  ): Promise<ProfileResponseInterface> {
    const user = await this.profileService.unfollowProfile(
      profileUsername,
      currentUserId,
    );
    return this.profileService.buildProfileResponse(user);
  }
}
