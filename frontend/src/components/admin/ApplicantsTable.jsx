import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { APPLICATOIN_API_END_POINT } from '@/utils/constant';

const shortlistingStatus = ["Accepted", "Rejected"];
const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);
    const statusHandler=async( status,id)=>{
        console.log("called");
           try {
            axios.defaults.withCredentials=true;
            const res=await axios.post(`${APPLICATOIN_API_END_POINT}/status/${id}/update`,{status});
            console.log(res);
   if(res.data.success){
    toast.success(res.data.message);
   }
           } catch (error) {
            toast.error(error.response.data.message);
            console.log(error);
           }
    }
    return (
        <div>
            <Table>
                <TableCaption>
                    A lis of your  recent applied users
                </TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>FullName</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className='text-right'>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        applicants && applicants?.applications?.map((application) => (

                            <tr key={application._id}>
                                <TableCell>{application?.applicant?.fullname}</TableCell>
                                <TableCell>{application?.applicant?.email}</TableCell>
                                <TableCell>{application?.applicant?.phoneNumber}</TableCell>
                                <TableCell >
                                    {
                                             application?.applicant?.profile?.resume ?<a className='text-blue-600 cursor-pointer' href={application?.applicant?.profile?.resume} target='_blank' rel="noopener noreferrer">{application?.applicant?.profile?.resumeOriginalName}</a>:<span>N/A</span>}
                                             </TableCell>

                                <TableCell>{application?.applicant?.createdAt.split("T")[0]}</TableCell>
                                <TableCell className='float-right cursor-pointer'>
                                    <Popover>
                                        <PopoverTrigger>
                                            <MoreHorizontal></MoreHorizontal>
                                        </PopoverTrigger>
                                        <PopoverContent className='w-32'>
                                            {
                                                shortlistingStatus.map((status, index) => {
                                                    return (
                                                        <div onClick={()=>statusHandler(status,application?._id)} key={index} className='flex w-fit items-center my-2 cursor-pointer'>
                                                            <span>{status}</span>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </PopoverContent>
                                    </Popover>

                                </TableCell>
                            </tr>
                        )

                        )
                    }

                </TableBody>

            </Table>
        </div>
    )
}

export default ApplicantsTable
