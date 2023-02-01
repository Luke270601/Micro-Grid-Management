using ActressMas;
using Micro_Grid_Management.Micro_Grid;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();


app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();
RunSim();

void RunSim()
{
    // inefficient, uses broadcast to simulate public open-cry auction

        //Sets up the ActressMas environment agent and the agent used to inform house agents
        var env = new EnvironmentMas(randomOrder: false, parallel: false);
            
        //Creates and instance of the energy distribution, battery agent and grid management in the environment
        var gridManager = new GridManager();
        var batteryAgent = new BatteryAgent();
        var environmentAgent = new EnvironmentAgent();
            
        env.Add(gridManager, "GridManager");
        env.Add(batteryAgent, "BatteryStorage");
        env.Add(environmentAgent, "Environment");
            
        //Adds houses to environment 
        for (int i = 1; i <= Settings.HouseCount; i++)
        {
            var houseAgent = new HouseAgent();
            env.Add(houseAgent, $"houseAgent{i:D2}");
        }
            
        //Adds solar panels to environment 
        for (int i = 1; i <= Settings.PanelCount; i++)
        {
            var solarPanelAgent = new SolarPanelAgent();
            env.Add(solarPanelAgent, $"solarPanel{i:D2}");
        }

        //Adds wind turbines to environment 
        for (int i = 1; i <= Settings.TurbineCount; i++)
        {
            var turbineAgent = new WindTurbineAgent();
            env.Add(turbineAgent, $"turbine{i:D2}");
        }
        env.Start();
}