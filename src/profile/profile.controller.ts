import { User } from '@app/user/decorators/user.decorators';
import { Controller, Get, Param } from '@nestjs/common';
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
}
