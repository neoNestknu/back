import {ConflictException, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {USERS_REPOSITORY} from "../../constants/constants";
import {Users} from "./entity/users.entity";
import {SignUserDto} from "../../dto/sign-user.dto";

@Injectable()
export class UserService {
    constructor(
        @Inject(USERS_REPOSITORY)
        private readonly usersRepository: typeof Users,
    ) {}

    async create(data: SignUserDto): Promise<Users> {
        await this.validateUser(data.email);
        return this.usersRepository.create({ ...data });
    }

    async findByEmail(email: string): Promise<Users> {
        return this.usersRepository.findOne({
            where: { email },
        });
    }

    async findById(id: string): Promise<Users> {
        const data = await this.usersRepository.findByPk(id);

        if (!data) {
            throw new NotFoundException('User with this id not found');
        }
        return data;
    }

    private async validateUser(email: string) {
        const dataValues = await this.usersRepository.findOne({
            where: { email },
        });

        if (dataValues) {
            throw new ConflictException('User with this email, already exists');
        }
    }
}
