using Microsoft.AspNetCore.Mvc;

namespace MyApi.Controllers;

using System;
using System.Collections;
using System.Collections.Specialized;
using System.Threading;
using System.Diagnostics;
//using System.Runtime.Remoting.Messaging;

[ApiController]
[Route("[controller]")]
public class WeatherForecastController : ControllerBase {
    HttpClient client;

    private static readonly string[] Summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    private readonly ILogger<WeatherForecastController> _logger;

    public WeatherForecastController(ILogger<WeatherForecastController> logger, IHttpClientFactory factory) {
        client = factory.CreateClient();
        _logger = logger;
    }

    [HttpGet(Name = "GetWeatherForecast")]
    public async Task<IEnumerable<WeatherForecast>> Get() {
        this._logger.LogInformation("Waiting Some bits....");

        //await Task.Delay(Random.Shared.Next(100,300));

        this._logger.LogInformation("Getting more details for weather request....");

        await this.client.PostAsJsonAsync("https://webhook.site/6cdcab04-cf49-432c-8e7f-0ffe827422ec", new { Data = "" });

        // this._logger.LogInformation("Getting more more details for weather request....");

        // await this.client.PostAsJsonAsync("https://webhook.site/c723d502-f8b7-49ca-95ab-b04a811f6fde", new { Data = "" });

        this._logger.LogInformation("Starting to respond with weather request data....");

        return Enumerable.Range(1, 5).Select(index => new WeatherForecast {
            Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            TemperatureC = Random.Shared.Next(-20, 55),
            Summary = Summaries[Random.Shared.Next(Summaries.Length)]
        }).ToArray();
    }
}
