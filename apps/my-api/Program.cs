using MyApi.Middleware;
using MyApi;

using static MyApi.ApplicationConstants;
using log4net;

var builder = WebApplication.CreateBuilder(args);
builder.Logging.ClearProviders();
builder.Logging.AddLog4Net();
// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddHttpClient("", options => {
    var currentCorrelationId = ThreadContext.Properties[CORRELATION_ID_KEY];

    //Console.WriteLine($"HERE IS THE TYPE {currentCorrelationId.GetType().Name}");

    if (currentCorrelationId is not string corId) return;

    //Console.WriteLine($"HERE I AM {currentCorrelationId}");

    options.DefaultRequestHeaders.Add(CORRELATION_ID_HEADER, corId);
});

var app = builder.Build();

app.UseMiddleware<CorrelationMiddleware>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.MapControllers();

app.Run();
