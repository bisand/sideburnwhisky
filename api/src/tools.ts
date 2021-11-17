export class Tools {
    public static getBoolean(value: any): boolean {
        if (value === true)
            return true;
        if (value === 1)
            return true;
        if ((/true/i).test(value))
            return true;
        if ((/1/i).test(value))
            return true;
        if ((/on/i).test(value))
            return true;
        if ((/yes/i).test(value))
            return true;
        return false;
    }
}
