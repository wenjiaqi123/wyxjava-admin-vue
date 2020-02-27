import Vue from 'vue'
import Router from 'vue-router'
import Admin from '@/components/admin/Admin'
import RotationChart from '@/components/home/RotationChart'
import AddChart from '@/components/home/AddChart'
import Subject from '@/components/curriculum/Subject'
import SubjectDetails from '@/components/curriculum/SubjectDetails'
import AddSubject from '@/components/curriculum/AddSubject'
import CourseList from '@/components/curriculum/CourseList'
import CourseDetails from '@/components/curriculum/CourseDetails'
import AddCourse from '@/components/curriculum/AddCourse'
import Question from '@/components/curriculum/Question'
import Navigation from '@/components/navgation/Navigation'
import HowUse from '@/components/navgation/howUse/HowUse'
import Vip from '@/components/navgation/vip/Vip'
import Teacher from '@/components/navgation/teacher/Teacher'
import Suggestion from '@/components/navgation/suggestion/Suggestion'
import Joke from '@/components/navgation/joke/Joke'
import Interview from '@/components/navgation/interview/Interview'
import Icu from '@/components/navgation/icu/Icu'
import Love from '@/components/navgation/love/Love'
import Offer from '@/components/navgation/offer/Offer'
import Wait from '@/components/navgation/wait/Wait'

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/Admin', name: 'Admin', component: Admin},
    {path: '/rotationChart', name: 'RotationChart', component: RotationChart},
    {path: '/addChart', name: 'AddChart', component: AddChart},
    {path: '/subject', name: 'Subject', component: Subject},
    {path: '/subjectDetails', name: 'SubjectDetails', component: SubjectDetails},
    {path: '/addSubject', name: 'AddSubject', component: AddSubject},
    {path: '/courseList', name: 'CourseList', component: CourseList},
    {path: '/courseDetails', name: 'CourseDetails', component: CourseDetails},
    {path: '/addCourse', name: 'AddCourse', component: AddCourse},
    {path: '/question', name: 'Question', component: Question},
    {path: '/navigation', name: 'Navigation', component: Navigation},
    {path: '/howUse', name: 'HowUse', component: HowUse},
    {path: '/vip', name: 'Vip', component: Vip},
    {path: '/teacher', name: 'Teacher', component: Teacher},
    {path: '/suggestion', name: 'Suggestion', component: Suggestion},
    {path: '/joke', name: 'Joke', component: Joke},
    {path: '/interview', name: 'Interview', component: Interview},
    {path: '/icu', name: 'Icu', component: Icu},
    {path: '/love', name: 'Love', component: Love},
    {path: '/offer', name: 'Offer', component: Offer},
    {path: '/wait', name: 'Wait', component: Wait}
  ]
})
