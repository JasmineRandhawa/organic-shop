import { Router } from '@angular/router';

//case insensitive contains of two strings
export function compare(str1:string,str2:string):boolean
{
  return str1.trim().toLowerCase().includes(str2.trim().toLowerCase());
}

//checks if a string is empty
export function isEmpty(str:string):boolean
{
  return !str || str.trim()==="";
}

export function showAlertOnAction(objectUpdated :string,
                                 isSuccess:any,action:string,
                                 router:Router, redirectPath:string)
{
  if (isSuccess) {
    alert(objectUpdated +" " + action + "d successfully!");
    router.navigate([redirectPath]);
  }
  else
    alert(action+" "+" failed");
}
