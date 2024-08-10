import dateFns from "date-fns";

export default class DateManipulation {
    static differenceInMinutes(rigthDate: Date, leftDate: Date): number {
        return dateFns.differenceInMinutes(rigthDate, leftDate);
    } 
} 