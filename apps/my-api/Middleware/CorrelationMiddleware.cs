namespace MyApi.Middleware;

using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using log4net;

using static MyApi.ApplicationConstants;

public readonly struct CorrelationId {
    public CorrelationId() {

    }

    public string Value { get; init; } = Guid.Empty.ToString();

    public static implicit operator CorrelationId(Guid guid) {
        return new CorrelationId {
            Value = guid.ToString(),
        };
    }

    public static implicit operator CorrelationId(string id) {
        return new CorrelationId {
            Value = id,
        };
    }

    public override string ToString() => Value;
}

public class CorrelationScope {
    private readonly AsyncLocal<CorrelationId> activityId = new AsyncLocal<CorrelationId>();

    public CorrelationId ActivityId { get { return activityId.Value; } set { activityId.Value = value; } }
}

public sealed class TraceInernal {
    // not creatable...
    //
    private TraceInernal() {

    }

    private static CorrelationScope? s_correlationManager;

    public static CorrelationScope CorrelationManager =>
        Volatile.Read(ref s_correlationManager) ??
        Interlocked.CompareExchange(ref s_correlationManager, new CorrelationScope(), null) ??
        s_correlationManager;

}

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

        //ThreadContext.Properties[CORRELATION_ID_KEY] = correlationId;
        TraceInernal.CorrelationManager.ActivityId = correlationId;

        context.Response.Headers.TryAdd(CORRELATION_ID_HEADER, correlationId);
        this.logger.LogInformation("Starting Request : {CorrelationId} ", correlationId);
        await next(context);
        this.logger.LogInformation("Request Completed : {CorrelationId} ", correlationId);
    }
}
