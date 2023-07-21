namespace MyApi.Middleware;

using log4net;

using static MyApi.ApplicationConstants;

public class CorrelationMiddleware {
    private readonly RequestDelegate next;
    private readonly ILogger logger;

    public CorrelationMiddleware(RequestDelegate next, ILogger<CorrelationMiddleware> logger) {
        this.next = next;
        this.logger = logger;
    }

    private string GetCorrelationId(HttpRequest request) {
        if (request.Headers.TryGetValue(CORRELATION_ID_HEADER, out var corHeader)) {
            this.logger.LogDebug("Received {HEADER} - {VALUE}", CORRELATION_ID_HEADER, corHeader);
            return corHeader.LastOrDefault() ?? Guid.NewGuid().ToString();
        }

        return Guid.NewGuid().ToString();
    }

    public async Task InvokeAsync(HttpContext context) {
        var correlationId = GetCorrelationId(context.Request);

        ThreadContext.Properties[CORRELATION_ID_KEY] = correlationId;
        context.Response.Headers.TryAdd(CORRELATION_ID_HEADER, correlationId);
        this.logger.LogInformation("Starting Request : {CorrelationId} ",correlationId);
        await next(context);
        this.logger.LogInformation("Request Completed : {CorrelationId} ",correlationId);
    }
}
