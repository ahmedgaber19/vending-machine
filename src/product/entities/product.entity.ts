import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn('increment')
    id:number

    @Column({nullable:false,length:20,unique:true})
    productName:string;

    @Column({nullable:false,type: 'decimal'})
    cost:number;

    @Column({nullable:false})
    amountAvailable:number;

    @ManyToOne(() => User, (sellerId) => sellerId.id,{
        eager:true,
        cascade:true,
        onDelete:'CASCADE',
        nullable:false,

    })
    seller: User;
}
