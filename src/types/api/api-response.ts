export type ApiResponse<D = void> = {
    code: number;
} & (
    | {
          success: true;
          data?: D;
          message?: string;
      }
    | {
          success: false;
          error: string;
      }
);
