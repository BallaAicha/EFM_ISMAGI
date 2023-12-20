export class Booking{
  constructor(
    public id:string,
    public placeId:string,//chaque réservation est liée à un lieu
    public userId:string,//chaque réservation est liée à un utilisateur
    public placeTitle:string,//titre du lieu
    public guestNumber:number,//nombre d'invités
    public placeImage:string,//image du lieu
    public firstName:string,//prénom de l'utilisateur
    public lastName:string,//nom de l'utilisateur

    public dateFrom:Date,//date de début de réservation
    public dateTo:Date//date de fin de réservation

  ){}
}
