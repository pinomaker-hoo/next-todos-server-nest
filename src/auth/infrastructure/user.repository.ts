// ** Typeorm Imports
import { EntityRepository, Repository } from 'typeorm';

// ** Entity Imports
import { User } from '../domain/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {}
