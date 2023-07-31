namespace MyApi.Converters;

using static MyApi.ApplicationConstants;
using log4net.Layout.Pattern;
using log4net;
using MyApi.Middleware;

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
        //Console.WriteLine($"Nopes : {TraceInernal.CorrelationManager.ActivityId}");

        var currentCorrelation = TraceInernal.CorrelationManager.ActivityId;

        if (currentCorrelation.Value == string.Empty) {
            return;
        }

        //if (Trace.CorrelationManager.ActivityId == default(Guid)) Trace.CorrelationManager.ActivityId = Guid.NewGuid();
        //if (Thread.CurrentThread.Name.IsNotNullOrEmpty()) writer.Write(Thread.CurrentThread.Name);
        writer.Write(currentCorrelation);
    }
}
