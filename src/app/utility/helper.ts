import { Router } from '@angular/router';

//case insensitive contains of two strings
export function compare(str1:string,str2:string):boolean
{
  return str1.trim().toLowerCase().includes(str2.trim().toLowerCase());
}

//checks if a string is empty
export function isEmpty(str:string|undefined|null):boolean
{
  return (str != undefined && str != null && str.trim()!=="") ? false : true;
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

//get current date and time
export function getCurrentDate() :string
{
  let date = new Date();
  return date.toUTCString();
}

//get cart Id from local storage
export function getCartIdFromLocalStorage()
{
  return localStorage.getItem('cartUId') || "";
}
