using System;
using System.Collections.Generic;
using Twilio.Rest.Video.V1.Room.Participant;

namespace Sabio.Models.Domain.ShareStory
{
    public class ShareStory
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Email { get; set; }

        public string Story { get; set; }

        public List<ShareStoryFile> Files { get; set; }

        public BaseUser CreatedBy { get; set; }

        public Boolean IsApproved { get; set; }

        public int ApprovedBy { get; set; }

        public DateTime DateCreated { get; set; }

        public DateTime DateModified { get; set;}
    }
    
}
