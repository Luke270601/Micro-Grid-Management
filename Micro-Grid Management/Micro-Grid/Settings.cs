namespace Micro_Grid_Management.Micro_Grid
{
    public class Settings
    {
        public static int PanelCount = 12;
        public static int TurbineCount = 3;
        public static int HouseCount = 1000;
        public static double EnergyFromGrid = 0;
        public static int HoursRunning = 0;
        
        public static Random RandomDemand = new Random();

        //Wind Turbine Information
        //radius of turbine rotor
        public static int radius = 58;
        public static double airDensity = 1.2;
        //how well wind can be converted to power
        public static double efficiencyFactor= 0.5;
        
        //Solar Panel Information
        //area of the solar panels
        public static double area = 3.12;
        //how efficiently sunlight is converted to energy 
        public static double efficiency = 0.2;
        //the solar iradtion in kw/h m^2
        public static double performanceRatio = 0.75;
        
    }
}