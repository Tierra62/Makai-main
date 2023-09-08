using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.InsuranceOptions
{
    public class InsuranceOption
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public DateTime OrderStartTime { get; set; }
        public DateTime OrderEstimatedStop { get; set; }
        public DateTime OrderActualStop { get; set; }
        public int OrderPriceInCents { get; set; }
        public int OrderPriceWithTax { get; set; }
        public DateTime StartTime{ get; set; }
        public DateTime EndTime { get; set; }
        public int Cost { get; set; }
        public bool IsActive { get; set; }
        public bool IsCancelled { get; set; }
        public DateTime CancelationDate { get; set; }
        public int CreatedById { get; set; }
        public string CreatedByFirstName { get; set; }
        public string CreatedByLastName { get; set; }
        public string CreatedByEmail { get; set; }
        public string CreatedByPhone { get; set; }
        public int ModifiedById { get; set; }
        public string ModifiedByFirstName { get; set; }
        public string ModifiedByLastName { get; set; }
        public string ModifiedByEmail { get; set; }
        public string ModifiedByPhone { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
    }
}
