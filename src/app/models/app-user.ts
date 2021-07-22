/*Data Model for App User*/
export class AppUser
{
    constructor( public uId:string = "", public name:string ="", 
                 public email:string ="", public isAdmin:boolean = false)
    {

    }

    get isLoggedIn()
    {
        return this.uId !=="";
    }
}