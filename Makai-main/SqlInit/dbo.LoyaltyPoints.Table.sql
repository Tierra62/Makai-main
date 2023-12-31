USE [Makai]
GO
/****** Object:  Table [dbo].[LoyaltyPoints]    Script Date: 5/12/2023 1:58:37 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LoyaltyPoints](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[SourceId] [int] NOT NULL,
	[Points] [int] NOT NULL,
	[DateCreated] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_LoyaltyPoints] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[LoyaltyPoints] ADD  CONSTRAINT [DF_LoyaltyPoints_Points]  DEFAULT ((0)) FOR [Points]
GO
ALTER TABLE [dbo].[LoyaltyPoints] ADD  CONSTRAINT [DF_LoyaltyPoints_DateCreated]  DEFAULT (getutcdate()) FOR [DateCreated]
GO
ALTER TABLE [dbo].[LoyaltyPoints]  WITH CHECK ADD  CONSTRAINT [FK_LoyaltyPoints_LoyaltyPointsSource] FOREIGN KEY([SourceId])
REFERENCES [dbo].[LoyaltyPointsSource] ([Id])
GO
ALTER TABLE [dbo].[LoyaltyPoints] CHECK CONSTRAINT [FK_LoyaltyPoints_LoyaltyPointsSource]
GO
