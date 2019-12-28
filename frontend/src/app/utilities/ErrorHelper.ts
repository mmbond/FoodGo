export class ErrorHelper {
    public static generateErrorObj(error: any) {
        return {
            status: error.status + ' ' + error.statusText,
            message: 'Something went wrong <br>with your request. ',
        };
    }
}
