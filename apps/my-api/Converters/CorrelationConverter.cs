namespace MyApi.Converters;

using static MyApi.ApplicationConstants;
using log4net.Layout.Pattern;
using log4net;

/// <summary>
///
/// Class handling to correlation Id log entries
/// </summary>
public class CorrelationConverter : PatternLayoutConverter {

    /// <summary>
    /// Writes correlation Id to logs
    /// </summary>
    /// <param name="writer"></param>
    /// <param name="loggingEvent"></param>
    protected override void Convert(TextWriter writer, log4net.Core.LoggingEvent loggingEvent) {
        var currentCorrelation = ThreadContext.Properties[CORRELATION_ID_KEY];

        if (currentCorrelation is null) return;

        //if (Trace.CorrelationManager.ActivityId == default(Guid)) Trace.CorrelationManager.ActivityId = Guid.NewGuid();
        //if (Thread.CurrentThread.Name.IsNotNullOrEmpty()) writer.Write(Thread.CurrentThread.Name);
        writer.Write(currentCorrelation);
    }
}
