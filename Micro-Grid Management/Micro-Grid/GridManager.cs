using ActressMas;

namespace Micro_Grid_Management.Micro_Grid
{
    public class GridManager : Agent
    {
        private int _houseAgentCount = Settings.HouseCount;
        private int _solarPanelCount = Settings.PanelCount;
        private int _windTurbineCount = Settings.TurbineCount;
        private double _supply = 0;
        private double _demand = 0;
        private bool _finished = false;

        public override void Setup()
        {
        }

        public override void Act(Message message)
        {
            try
            {
                message.Parse(out var action, out string parameters);
                if (Settings.HoursRunning < 24)
                {
                    switch (action)
                    {
                        case "demand":
                            Console.WriteLine(message.Sender + " : " + parameters);
                            _demand += Convert.ToDouble(parameters);
                            _houseAgentCount--;
                            break;

                        case "supply":
                            Console.WriteLine(message.Sender + " : " + parameters);
                            if (message.Sender.Contains("solarPanel"))
                            {
                                _solarPanelCount--;
                                _supply += Convert.ToDouble(parameters);
                            }

                            else
                            {
                                _windTurbineCount--;
                                _supply += Convert.ToDouble(parameters);
                            }

                            break;

                        case "energy_stored":
                            Console.WriteLine(message.Sender + " : " + "Energy has been stored");
                            Broadcast("generate");
                            Settings.HoursRunning++;
                            break;

                        case "demand_met":
                            Console.WriteLine(message.Sender + " : " + "Battery provided power");
                            Broadcast("generate");
                            Settings.HoursRunning++;
                            break;

                        case "demand_remaining":
                            _demand = Convert.ToDouble(parameters);
                            Console.WriteLine(message.Sender + " : " + Convert.ToDouble(parameters) +
                                              " demand remaining");
                            SupplyFromGrid(_demand);
                            Broadcast("generate");
                            Settings.HoursRunning++;
                            break;

                        case "stop":
                            Console.Write("Stopping Panel");
                            Stop();
                            break;
                    }
                }
                else
                {
                    Send(message.Sender, "stop");
                    _finished = true;
                }
            }

            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }
        

        public override void ActDefault()
        {
            if (_houseAgentCount == 0 && _solarPanelCount == 0 && _windTurbineCount == 0)
            {
                _houseAgentCount = Settings.HouseCount;
                _solarPanelCount = Settings.PanelCount;
                _windTurbineCount = Settings.TurbineCount;
                SupplyDemand(_supply, _demand);
                _supply = 0;
                _demand = 0;
            }
            else if (_finished)
            {
                Console.WriteLine("End of simulation");
                Console.WriteLine("Total From Grid: " + Settings.EnergyFromGrid + " kw/h");
                Send("BatteryStorage", "stop");
                Send("Environment", "stop");
                Stop();
            }
        }

        private void SupplyDemand(double supply, double demand)
        {
            if (supply > demand)
            {
                supply -= demand;
                Send("BatteryStorage", $"supply {supply}");
            }

            else if (supply < demand)
            {
                demand -= supply;
                Send("BatteryStorage", $"request {demand}");
            }

            else
            {
                Broadcast("generate");
            }
        }

        private void SupplyFromGrid(double demand)
        {
            Settings.EnergyFromGrid += demand;
            Console.WriteLine("Taken From Grid: " + demand);
            Console.WriteLine("Total From Grid: " + Settings.EnergyFromGrid);
        }
    }
}