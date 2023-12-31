USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[Users_SelectById]    Script Date: 5/10/2023 10:00:14 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO





-- =============================================
-- Author:		Bounheuangviseth, Vanhxay
-- Create date: 2/24/2023
-- Description:	Select User By Id from dbo.Users
-- Reviewer: Christian Ramos

-- Modified By: Josiah Gonzales
-- Modified Date: 5/3/2023
-- Description: Adding 2fa bool
-- Reviewer: 
-- =============================================


CREATE proc [dbo].[Users_SelectById]
							@Id int


/*

	Declare @Id int = 707

	Execute dbo.Users_SelectById
								@Id 

*/


as

BEGIN

	SELECT	u.Id
			,u.Email
			,u.Phone
			,u.FirstName
			,u.LastName
			,u.Mi 
			,u.AvatarUrl
			,u.DOB
			,Roles = ( SELECT	 r.Id
								,r.Name
						
						FROM	dbo.Roles as r inner join dbo.UserRoles as ur
										on r.Id = ur.RoleId 
						WHERE	u.Id = ur.UserId
						FOR		JSON AUTO )
			,st.Id 
			,st.Name
			,u.Is2FA
			
			
	FROM	dbo.Users as u inner join dbo.StatusTypes as st
						on u.StatusId = st.Id
			
			
	WHERE	u.Id = @Id				

END
GO
