import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "../user-role.enum";
@Entity()
export class User {

    @PrimaryGeneratedColumn('increment')
    id:number

    @Column({unique:true,nullable:false,length:20})
    userName:string;

    @Column({nullable:false,length:20})
    password:string;

    @Column({default:0,type:'decimal'})
    deposit: number;

    @Column({
        enum: UserRole,
      })
    role:string
    
}
