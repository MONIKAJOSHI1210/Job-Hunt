import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

export const applyJob= async(req,res)=> {
    try {
        const userId=req.id;
        // const {id ,jobId}=req.params;
        const jobId=req.params.id;
        if(!jobId){
            return res.status(400).json({
                message:"Job Id is required",
                success:false
            })
        }
        //check for user has already applied
        const existingApplication= await Application.findOne({job:jobId,applicant:userId});
        if(existingApplication){
            return res.status(400).json({
                message:"You have already applied for this jobs",
                success:false
            })
        }
        //check if the jobs exists
         const job=await Job.findById(jobId);
         if(!job){
            return res.status(404).json({
                message:"Job Not available",
                success:false
            })
         }
         // create a new application
         const newApplication = await Application.create({
            job:jobId,
            applicant:userId,

         });
         job.applications.push(newApplication._id);
         await job.save();
         return res.status(201).json({
            message : "Job applied successfully",
            success:true
         })

    } catch (error) {
        console.log(error);
    }
};
export const getAppliedJobs= async(req,res)=>{
    try{
      const userId=req.id;
      const application= await Application.find({applicant:userId}).sort({created:-1}).populate({
        path:'job',
        options:{sort:{createdAt:-1}},
        populate:{
            path:"company",
            options:{sort:{createdAt:-1}}
      }
      });
      if(!application){
        return res.status(400).json({
            message:"No Applications ",
            success:false
        })
      }
      return res.status(200).json({
        application,
        success:true
      })

    }catch(error){
        console.log(error);
    }
};
//how many students applied 
export const getApplicants= async(req,res)=>{
    try {
        const jobId=req.params.id;
        const job= await Job.findById(jobId).populate({
            path:'applications',
            options:{sort:{createdA4:-1}},
            populate:{
                path:'applicant',
                options:{sort:{createdAt:-1}}

            }
        });

        if(!job){
            return res.status(404).json({
               message:"Job not found",
               success:false
            })
        }
        return res.status(200).json({
            job,
            success:true
        });

    } catch (error) {
        conaole.log(error);
    }
}
export const updateStatus =async(req,res)=>{
    try {
        const {status}=req.body;
        const applicationId =req.params.id;
        if(!status){
            return res.status(400).json({
                message:"Status not found it is required",
                success:false
            })
        }
        //find the application by applicant id
        const application = await Application.findOne({_id:applicationId});
        if(!application){
          return res.status(400).json({
            meassage:"No application found",
            success:false
          });
        }
        //update the status
        application.status= status.toLowerCase();
        await application.save();
        return res.status(200).json({
            message:"updated successfully",
            application,
            success:true
        })
     } catch (error) {
        console.log(error);
    }
}