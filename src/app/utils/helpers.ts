export class Helpers
{
    public static removeWhiteSpaces(ev: any): any {
        for (const key in ev) {
            let text = ev[key];
            if (!!text) {
                ev[key] = text.toString().trim();
            }
        }
        return ev;
    }

    public static IntegerOnly(ev: any): boolean
    {
        const key = ev.keyCode;
        return ((key >= 48 && key <= 57) || (key >= 96 && key <= 105) || key === 8 || key === 9 || key === 46 || (key >= 37 && key <= 40));
    }

    public static DoubleOnly(ev: any): boolean
    {
        const key = ev.keyCode;
        return ((key >= 48 && key <= 57) || (key >= 96 && key <= 105) || key === 8 || key === 9 || key === 190 || (key >= 37 && key <= 40));
    }

    public static AlphaOnly(ev: any, codes: number[] = []): boolean
    {
        const key = ev.keyCode;

        if (codes != null && codes.length > 0)
        {
            if (codes.includes(key))
            {
                return true;
            }
        }

        return ((key >= 65 && key <= 90) || key === 8 || key === 9 || key === 32 || key === 46 || (key >=37 && key <= 40));
    }

    public static GetRandomUsername(): string
    {
        const userName = Math.random().toString(36).slice(-6);

        return userName;
    }

    public static GetRandomPassword(length: number = 6): string
    {
        const numbers = '0123456789';
        // const specials = '~`!@#$%^&*()-_=+[{]}\\|;:\'\",<.>/?';
        const specials = '@!$%*[]{}()';
        const uppers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowers = 'abcdefghijklmnopqrstuvwxyz'

        let password = uppers.charAt(Math.floor(Math.random() * uppers.length));

        for ( let i = 0; i < length - 3; i++ )
        {
            password += lowers.charAt(Math.floor(Math.random() * lowers.length));
        }

        password += specials.charAt(Math.floor(Math.random() * specials.length));
        password += numbers.charAt(Math.floor(Math.random() * numbers.length));

        return password;
    }
}