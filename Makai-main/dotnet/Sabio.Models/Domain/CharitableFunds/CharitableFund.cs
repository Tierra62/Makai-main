using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.CharitableFunds
{
    public class CharitableFund
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Url { get; set; }       
        public bool IsDeleted { get; set; }
        public string UserFirstName { get; set; }
        public string UserLastName { get; set; }
        public string UserEmail { get; set; }         
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }

    }
}
