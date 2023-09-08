using System;

namespace Sabio.Models.Domain.StandCodes
{
    public class StandCode
    {
        public int Id { get; set; }
        public string UniqueCode { get; set; }
        public int StandId { get; set; }
        public double Longitude { get; set; }
        public double Latitude { get; set; }
        public string LineOne { get; set; }
        public string LineTwo { get; set; }
        public string City { get; set; }
        public string Zip { get; set; }
        public int PartnerId { get; set; }
        public string PartnerLogo { get; set; }
        public DateTime DateCreated { get; set; }
        public int CreatedBy { get; set; }
    }
}
