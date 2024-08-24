export const createSuccessResponse = (message: string, status: number) => {
    return Response.json(
      { success: true, message },
      { status }
    );
  };
  
  export const createErrorResponse = (message: string, status: number) => {
    return Response.json(
      { success: false, message },
      { status }
    );
  };
  