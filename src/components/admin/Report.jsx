import { GridFilterListIcon } from '@mui/x-data-grid';
import React, { useState, useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import DropdownSelect from 'react-dropdown-select';
import { formatDate, classNames } from '/src/components/utilities/tools.js';
import { useTranslation } from "next-i18next";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const Report = () => {
    const supabase = useSupabaseClient();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { t } = useTranslation(['common', 'dashboard', 'filter', 'other', 'report']);
    const [families, setFamilies] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const [genders, setGenders] = useState([]);
    const [selectedGender, setSelectedGender] = useState('');
    const [households, setHouseholds] = useState([]);
    const [selectedHousehold, setSelectedHousehold] = useState('');
    const [stateRegions, setStateRegions] = useState([]);
    const [selectedStateRegion, setSelectedStateRegion] = useState('');
    const [districts, setDistricts] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [townships, setTownships] = useState([]);
    const [selectedTownship, setSelectedTownship] = useState('');
    const [wardVillageTracts, setWardVillageTracts] = useState([]);
    const [selectedWardVillageTract, setSelectedWardVillageTract] = useState('');
    const [villages, setVillages] = useState([]);
    const [selectedVillage, setSelectedVillage] = useState('');

    const [occupations, setOccupations] = useState([]);
    const [selectedOccupation, setSelectedOccupation] = useState('');
    const [educations, setEducations] = useState([]);
    const [selectedEducation, setSelectedEducation] = useState('');
    const [ethnicities, setEthnicities] = useState([]);
    const [selectedEthnicity, setSelectedEthnicity] = useState('');
    const [religions, setReligions] = useState([]);
    const [selectedReligion, setSelectedReligion] = useState('');
    const [deaths, setDeaths] = useState([]);
    const [selectedDeath, setSelectedDeath] = useState('');
    const [minAge, setMinAge] = useState('');
    const [maxAge, setMaxAge] = useState('');
    const [resident, setResident] = useState([]);
    const [selectedResident, setSelectedResident] = useState([]);
    const [isDisability, setDisability] = useState([]);
    const [selectedDisability, setSelectedDisability] = useState('');
    
    useEffect(() => {
        const fetchData = async () => {
          try {
            fetchFamilies();
            fetchOccupation();
            fetchEducation();
            fetchEthnicity();
            fetchReligion();
            fetchDeaths();
            fetchGenders(),
            fetchHouseholds();
            fetchStateRegions();
            fetchDistricts();
            fetchTownships();
            fetchWardVillageTracts();
            fetchVillages();
            fetchResident();
            fetchIsDisability();
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
      
        fetchData();
    }, []);
    
    const fetchFamilies = async () => {
        setIsLoading(true);
        setErrorMessage(null);
      
        let query = supabase.from('families').select(`
          id, 
          name, 
          date_of_birth,
          nrc_id,
          gender,
          father_name,
          mother_name,
          remark,
          resident,
          isDeath,
          deaths(id),
          isDisability,
          disabilities (id),
          relationships (id, name),
          occupations (id, name),
          educations (id, name),
          ethnicities (id, name),
          nationalities (id, name),
          religions (id, name),
          households (household_no, state_regions(name), townships(name), districts(name), ward_village_tracts(name), villages(name)),
          household_no
        `);
      
        if (selectedDeath === 'No') {
          query = query.eq('isDeath', 'No');
        } else if (selectedDeath === 'Yes') {
          query = query.eq('isDeath', 'Yes');
        }
      
        try {
          const { data: familiesData, error: familiesError } = await query;
      
          if (familiesError) throw new Error(familiesError.message);
      
          setFamilies(familiesData);
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching families:', error);
        }
    };

    async function fetchIsDisability() {
        try {
          const { data, error } = await supabase
            .from('families')
            .select('id, name, isDisability');
            
          if (error) {
            throw new Error(error.message);
          }
      
          // Extract unique Disability values
          const uniqueIsDisability = [];
          data.forEach(family => {
            if (!uniqueIsDisability.includes(family.isDisability)) {
              uniqueIsDisability.push(family.isDisability);
            }
          });
      
          // Group families by the Disability property
          const groupedFamilies = {};
          uniqueIsDisability.forEach(isDisabilityValue => {
            groupedFamilies[isDisabilityValue] = data.filter(family => family.isDisability === isDisabilityValue);
          });
      
          setDisability(groupedFamilies);
        } catch (error) {
          console.log('Error fetching isDisability:', error.message);
        }
    }

    async function fetchResident() {
        try {
          const { data, error } = await supabase
            .from('families')
            .select('id, name, resident');
        
          if (error) {
            throw new Error(error.message);
          }
      
          const uniqueResident = [];
          const groupedFamilies = {};
      
          data.forEach(family => {
            if (!uniqueResident.includes(family.resident)) {
              uniqueResident.push(family.resident);
              groupedFamilies[family.resident] = [];
            }
            groupedFamilies[family.resident].push(family);
          });
      
          setResident(groupedFamilies);
        } catch (error) {
          console.log('Error fetching resident:', error.message);
        }
    }

      
    // async function fetchResident() {
    //     try {
    //       const { data, error } = await supabase
    //         .from('families')
    //         .select('id, name, resident');
          
    //       if (error) {
    //         throw new Error(error.message);
    //       }
      
    //       // Extract unique resident values
    //       const uniqueResident = [...new Set(data.map(family => family.resident))];
      
    //       // Group families by the resident property
    //       const groupedFamilies = uniqueResident.reduce((groups, residentValue) => {
    //         groups[residentValue] = data.filter(family => family.resident === residentValue);
    //         return groups;
    //       }, {});
      
    //       setResident(groupedFamilies);
    //     } catch (error) {
    //       console.log('Error fetching resident:', error.message);
    //     }
    // }
    
    async function fetchDeaths() {
        try {
          const { data, error } = await supabase
            .from('families')
            .select('isDeath');
        
          if (error) {
            throw new Error(error.message);
          }
      
          const uniqueDeaths = [];
          data.forEach(row => {
            if (!uniqueDeaths.includes(row.isDeath)) {
              uniqueDeaths.push(row.isDeath);
            }
          });
      
          setDeaths(uniqueDeaths);
        } catch (error) {
          console.log('Error fetching deaths:', error.message);
        }
    }

      
    // async function fetchDeaths() {
    //     try {
    //       const { data, error } = await supabase
    //       .from('families')
    //       .select('isDeath');
      
    //       if (error) {
    //         throw new Error(error.message);
    //       }
      
    //       const uniqueDeaths = [...new Set(data.map((row) => row.isDeath))];
      
    //       setDeaths(uniqueDeaths);
    //     } catch (error) {
    //       console.log('Error fetching deaths:', error.message);
    //     }
    // }

    async function fetchGenders() {
        try {
          const { data, error } = await supabase
            .from('families')
            .select('gender');
        
          if (error) {
            throw new Error(error.message);
          }
      
          const uniqueGenders = [];
          data.forEach(row => {
            if (!uniqueGenders.includes(row.gender)) {
              uniqueGenders.push(row.gender);
            }
          });
      
          setGenders(uniqueGenders);
        } catch (error) {
          console.log('Error fetching gender:', error.message);
        }
      }

      
    // async function fetchGenders() {
    //     try {
    //       const { data, error } = await supabase
    //       .from('families')
    //       .select('gender');
      
    //       if (error) {
    //         throw new Error(error.message);
    //       }
      
    //       // Extract unique gender values by filtering out duplicates
    //       const uniqueGenders = [...new Set(data.map((row) => row.gender))];
      
    //       setGenders(uniqueGenders);
    //     } catch (error) {
    //       console.log('Error fetching gender:', error.message);
    //     }
    // }
    
    async function fetchOccupation() {
        try {
          const { data, error } = await supabase.from('occupations').select('id, name');
          if (error) {
            throw new Error(error.message);
          }
          setOccupations(data);
        } catch (error) {
          console.log('Error fetching occupations:', error.message);
        }
    }

    async function fetchEducation() {
        try {
          const { data, error } = await supabase.from('educations').select('id, name');
          if (error) {
            throw new Error(error.message);
          }
          setEducations(data);
        } catch (error) {
          console.log('Error fetching educations:', error.message);
        }
    }

    async function fetchEthnicity() {
        try {
          const { data, error } = await supabase.from('ethnicities').select('id, name');
          if (error) {
            throw new Error(error.message);
          }
          setEthnicities(data);
        } catch (error) {
          console.log('Error fetching ethnicities:', error.message);
        }
    }

    async function fetchReligion() {
        try {
          const { data, error } = await supabase.from('religions').select('id, name');
          if (error) {
            throw new Error(error.message);
          }
          setReligions(data);
        } catch (error) {
          console.log('Error fetching religions:', error.message);
        }
    }
    

    async function fetchHouseholds() {
        try {
          const { data, error } = await supabase.from('households').select('id, household_no').order("household_no");
          if (error) {
            throw new Error(error.message);
          }
          setHouseholds(data);
        } catch (error) {
          console.log('Error fetching households:', error.message);
        }
    }
    
    async function fetchStateRegions() {
        try {
          const { data, error } = await supabase.from('state_regions').select('id, name');
          if (error) {
            throw new Error(error.message);
          }
          setStateRegions(data);
        } catch (error) {
          console.log('Error fetching state regions:', error.message);
        }
    }

    async function fetchDistricts() {
        try {
          const { data, error } = await supabase.from('districts').select('id, name');
          if (error) {
            throw new Error(error.message);
          }
          setDistricts(data);
        } catch (error) {
          console.log('Error fetching districts:', error.message);
        }
    }

    async function fetchTownships() {
        try {
          const { data, error } = await supabase.from('townships').select('id, name');
          if (error) {
            throw new Error(error.message);
          }
          setTownships(data);
        } catch (error) {
          console.log('Error fetching townships:', error.message);
        }
    }

    async function fetchWardVillageTracts() {
        try {
          const { data, error } = await supabase.from('ward_village_tracts').select('id, name');
          if (error) {
            throw new Error(error.message);
          }
          setWardVillageTracts(data);
        } catch (error) {
          console.log('Error fetching ward village tracts:', error.message);
        }
    }

    async function fetchVillages() {
        try {
          const { data, error } = await supabase.from('villages').select('id, name');
          if (error) {
            throw new Error(error.message);
          }
          setVillages(data);
        } catch (error) {
          console.log('Error fetching villages:', error.message);
        }
    }
    
    // Function to check if the age matches the selected age filter
    const checkAge = (dateOfBirth) => {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        const age = today.getFullYear() - birthDate.getFullYear();
        // const monthDiff = today.getMonth() - birthDate.getMonth();
        const isMatchingAge =
          (minAge === '' || age >= minAge) && (maxAge === '' || age <= maxAge);
    
        return isMatchingAge;
    };
    const handleMinAgeChange = (e) => {
        const inputMinAge = e.target.value !== '' ? parseInt(e.target.value) : '';
        setMinAge(inputMinAge);
    };
    const handleMaxAgeChange = (e) => {
        const inputMaxAge = e.target.value !== '' ? parseInt(e.target.value) : '';
        setMaxAge(inputMaxAge);
    };

    //Multi Select resident start
    const options = Object.keys(resident).map((residentValue) => ({
        value: residentValue,
        label: `${residentValue} (${resident[residentValue].length})`,
    }));

    const handleSelectChange = (selectedItems) => {
    const selectedValues = selectedItems.map((item) => item.value);
    setSelectedResident(selectedValues);
    };
    //Multi Select resident End
    
    // Filtered faimiles based on search and filters  
    const filterFamilies = families.filter((family) => {
        const isMatchingSearchQuery =
        (family.name && family?.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (family.nrc_id && family?.nrc_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (family.date_of_birth && formatDate(family.date_of_birth).startsWith(searchQuery)) ||
        (family.gender && family?.gender.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (family.father_name && family?.father_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (family.mother_name && family?.mother_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (family.remark && family?.remark.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const isMatchingDeath =
        selectedDeath === '' || family.isDeath === selectedDeath;

        const isMatchingOccupation =
        selectedOccupation === '' || family.occupations.name === selectedOccupation;

        const isMatchingEducation =
        selectedEducation === '' || family.educations.name === selectedEducation;

        const isMatchingEthnicity =
        selectedEthnicity === '' ||
        family.ethnicities.name === selectedEthnicity;

        const isMatchingReligion = 
        selectedReligion === '' || family.religions?.name === selectedReligion;
            
        const isMatchingGender =
        selectedGender === '' || family.gender === selectedGender;
        
        const isMatchingAge = checkAge(family.date_of_birth);

        const isMatchingStateRegion =
            selectedStateRegion === '' || family.households.state_regions.name === selectedStateRegion;
    
        const isMatchingDistrict = selectedDistrict === '' || family.households.districts.name === selectedDistrict;
    
        const isMatchingTownship =
            selectedTownship === '' || family.households.townships.name === selectedTownship;
    
        const isMatchingWardVillageTract =
            selectedWardVillageTract === '' || family.households.ward_village_tracts.name === selectedWardVillageTract;
    
        const isMatchingVillage = selectedVillage === '' || family.households.villages.name === selectedVillage;

        const isMatchingHousehold = selectedHousehold === '' || family.household_no === selectedHousehold;

        const isMatchingResident = selectedResident.length === 0 || selectedResident.includes(family.resident);
        
        const isMatchingIsDisability = selectedDisability.length === 0 || selectedDisability.includes(family.isDisability);

        // const isMatchingIsDisability = selectedDisability === '' || family.isDisability === selectedDisability;

        return (
            isMatchingDeath &&
            isMatchingOccupation &&
            isMatchingEducation &&
            isMatchingEthnicity &&
            isMatchingReligion &&
            isMatchingGender &&
            isMatchingAge &&
            isMatchingHousehold &&
            isMatchingSearchQuery &&
            isMatchingStateRegion &&
            isMatchingDistrict &&
            isMatchingTownship &&
            isMatchingWardVillageTract &&
            isMatchingResident &&
            isMatchingIsDisability &&
            isMatchingVillage
        );
    });
    
    // Pagination Start
    const [currentPage, setCurrentPage] = useState(0);
    const [perPage] = useState(10);
    const offset = currentPage * perPage;
    const currentPageData = filterFamilies.slice(offset, offset + perPage);
    const goToPreviousPage = () => {
        if (currentPage > 0) {
          setCurrentPage(currentPage - 1);
        }
    };
    const goToNextPage = () => {
    if (currentPage < Math.ceil(filterFamilies.length / perPage) - 1) {
        setCurrentPage(currentPage + 1);
    }
    };
    // Pagination End
    
    const [showFilter, setShowFilter] = useState(false);

    const handleToggleFilter = () => {
        setShowFilter(!showFilter);
    };

    //Print and save pdf
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const handleSaveAsPdf = () => {
        const doc = new jsPDF();
        doc.autoTable({
          head: [['Name', 'Age', 'School']],
          body: filterFamilies.map((item) => [item.name, item.age, item.school]),
        });
        doc.save('table.pdf');
    };

    return (
        <div className='py-4'>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="p-2 mr-2 border border-gray-300 rounded-md"
                    placeholder={t("filter.Search")}
                />
                <button
                    onClick={handleToggleFilter}
                    className="px-4 py-2 text-white bg-blue-400 rounded-md"
                >
                <GridFilterListIcon className="w-5 h-5 mr-2"></GridFilterListIcon>
                    Filter
                </button>
                </div>
                <p className="text-gray-500">{t("filter.TotalResults")}: {filterFamilies.length}</p>
            </div>

            {showFilter && (
            <div className="py-4 sm:grid sm:grid-cols-6 sm:gap-4">
                <div>
                    <select
                    value={selectedHousehold}
                    onChange={(e) => setSelectedHousehold(e.target.value)}
                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-sky-600 sm:text-sm sm:leading-6"
                    >
                    <option value="">{t("filter.Households")}</option>
                        {/* Render state region options */}
                        {households.map((household) => (
                            <option key={household.id} value={household.household_no}>
                        {household.household_no}
                        </option>
                    ))}
                    </select>
                </div>
                <div>
                    <select
                    value={selectedStateRegion}
                    onChange={(e) => setSelectedStateRegion(e.target.value)}
                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-sky-600 sm:text-sm sm:leading-6"
                    >
                    <option value="">{t("filter.StateRegions")}</option>
                        {/* Render state region options */}
                        {stateRegions.map((stateRegion) => (
                            <option key={stateRegion.id} value={stateRegion.name}>
                        {stateRegion.name}
                        </option>
                    ))}
                    </select>
                </div>
                    
                <div>
                    <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-sky-600 sm:text-sm sm:leading-6">
                        <option value="">{t("filter.Districts")}</option>
                        {/* Render district options */}
                        {districts.map((district) => (
                            <option key={district.id} value={district.name}>
                            {district.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <select value={selectedTownship} onChange={(e) => setSelectedTownship(e.target.value)} className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-sky-600 sm:text-sm sm:leading-6">
                    <option value="">{t("filter.Townships")}</option>
                    {/* Render township options */}
                    {townships.map((township) => (
                        <option key={township.id} value={township.name}>
                        {township.name}
                        </option>
                    ))}
                    </select>
                </div>
                
                <div>
                    <select value={selectedWardVillageTract} onChange={(e) => setSelectedWardVillageTract(e.target.value)} className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-sky-600 sm:text-sm sm:leading-6">
                        <option value="">{t("filter.WardVillageTracts")}</option>
                        {/* Render ward/village tract options */}
                        {wardVillageTracts.map((wardVillageTract) => (
                            <option key={wardVillageTract.id} value={wardVillageTract.name}>
                            {wardVillageTract.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <select value={selectedVillage} onChange={(e) => setSelectedVillage(e.target.value)} className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-sky-600 sm:text-sm sm:leading-6">
                        <option value="">{t("filter.Villages")}</option>
                            {villages.map((village) => (
                            <option key={village.id} value={village.name}>
                            {village.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <select 
                    value={selectedOccupation}
                    onChange={(e) => setSelectedOccupation(e.target.value)}
                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-sky-600 sm:text-sm sm:leading-6">
                        <option value="">{t("filter.Occupations")}</option>
                        {/* Render Occupations options */}
                        {occupations.map((occupation) => (
                            <option key={occupation.id} value={occupation.name}>
                            {occupation.name}
                            </option>
                        ))}
                    </select>
                </div>
                    
                <div>
                    <select value={selectedEducation} onChange={(e) => setSelectedEducation(e.target.value)} className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-sky-600 sm:text-sm sm:leading-6">
                        <option value="">{t("filter.Educations")}</option>
                        {/* Render Educations options */}
                        {educations.map((education) => (
                            <option key={education.id} value={education.name}>
                            {education.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <select value={selectedEthnicity} onChange={(e) => setSelectedEthnicity(e.target.value)} className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-sky-600 sm:text-sm sm:leading-6">
                        <option value="">{t("filter.Ethnicities")}</option>
                        {/* Render Ethnicities options */}
                        {ethnicities.map((ethnicity) => (
                            <option key={ethnicity.id} value={ethnicity.name}>
                            {ethnicity.name}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div>
                    <select value={selectedReligion} onChange={(e) => setSelectedReligion(e.target.value)} className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-sky-600 sm:text-sm sm:leading-6">
                        <option value="">{t("filter.Religions")}</option>
                        {/* Render Religions options */}
                        {religions.map((religion) => (
                            <option key={religion.id} value={religion.name}>
                            {religion.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <select
                        value={selectedGender}
                        onChange={(e) => setSelectedGender(e.target.value)}
                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-sky-600 sm:text-sm sm:leading-6"
                    >
                        <option value="">{t("filter.Gender")}</option>
                        {genders.map((gender) => (
                        <option key={gender} value={gender}>
                            {gender}
                        </option>
                        ))}
                    </select>
                </div>
                <div>
                    <select
                        value={selectedDisability}
                        onChange={(e) => setSelectedDisability(e.target.value)}
                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-sky-600 sm:text-sm sm:leading-6"
                    >
                        <option value="">{t("filter.IsDisabilities")}</option>
                        {Object.keys(isDisability).map((d) => (
                        <option key={d} value={d}>
                            {d} ({isDisability[d].length})
                        </option>
                        ))}
                    </select>
                </div> 
                <div>
                    <select
                        value={selectedDeath}
                        onChange={(e) => setSelectedDeath(e.target.value)}
                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-sky-600 sm:text-sm sm:leading-6"
                    >
                        <option value="">{t("filter.IsDeath")}</option>
                        {deaths.map((death) => (
                        <option key={death} value={death}>
                            {death}
                        </option>
                        ))}
                    </select>
                </div>
                <div>
                    <DropdownSelect
                        multi
                        values={selectedResident}
                        options={options}
                        onChange={handleSelectChange}
                        placeholder={t("filter.resident")}
                        style={{
                        zIndex: 40,
                        marginTop: 9,
                        borderRadius: '0.375rem',
                        padding: '0.375rem 0.75rem',
                        color: '#4b5563',
                        ring: '1px inset #e2e8f0',
                        focusRing: '2px solid #93c5fd',
                        fontSize: '0.875rem',
                        lineHeight: '1.25rem',
                        }}
                    />
                </div>

                <div>
                    <input
                    type="number"
                    value={minAge}
                    onChange={handleMinAgeChange}
                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-sky-600 sm:text-sm sm:leading-6"
                    placeholder={t("filter.MinAge")}
                    />
                </div>
                <div>
                    <input
                    type="number"
                    value={maxAge}
                    onChange={handleMaxAgeChange}
                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-sky-600 sm:text-sm sm:leading-6"
                    placeholder={t("filter.MaxAge")}
                    />
                </div>
            </div>
           
            )}
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                   
                    <table className="min-w-full border-separate border-spacing-0">
                        <thead className='bg-gray-300'>
                            <tr>
                                <th
                                    scope="col"
                                    className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                                >
                                    {t("No")}
                                </th>
                                <th
                                    scope="col"
                                    className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                                >
                                    {t("Name")}
                                </th>
                                <th
                                    scope="col"
                                    className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                                >
                                    {t("NRC")}
                                </th>
                                <th
                                    scope="col"
                                    className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                                >
                                    {t("DOB")}
                                </th>
                                <th
                                    scope="col"
                                    className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                                >
                                    {t("Age")}
                                </th>
                                <th
                                    scope="col"
                                    className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                                >
                                    {t("Gender")}
                                </th>
                                <th
                                    scope="col"
                                    className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                                >
                                    {t("FatherName")}
                                </th>
                                <th
                                    scope="col"
                                    className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                                >
                                    {t("MotherName")}
                                </th>
                                <th
                                    scope="col"
                                    className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                                >
                                    {t("HouseholdNo")}
                                </th>
                                <th
                                    scope="col"
                                    className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                                >
                                    {t("Address")}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="py-4 pl-4 pr-3 text-lg">
                                    {isLoading && <p>Loading...</p>}
                                    {errorMessage && <p>{errorMessage}</p>}
                                </td>
                            </tr>

                            {currentPageData.map((family, familyIdx) => (
                            <tr key={family.id} className='transition duration-300 ease-in-out border-b hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600'>
                                <td
                                className={classNames(
                                    familyIdx !== family.length - 1 ? 'border-b border-gray-200' : '',
                                    'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                                )}
                                >
                                {(currentPage * perPage) + familyIdx + 1}
                                </td>
                                <td
                                className={classNames(
                                    familyIdx !== family.length - 1 ? 'border-b border-gray-200' : '',
                                    'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                                )}
                                >
                                {family.name}
                                </td>
                                <td
                                className={classNames(
                                    familyIdx !== family.length - 1 ? 'border-b border-gray-200' : '',
                                    'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                                )}
                                >
                                    {family.nrc_id || 'NA'}
                                </td>
                                <td
                                className={classNames(
                                    familyIdx !== family.length - 1 ? 'border-b border-gray-200' : '',
                                    'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                                )}
                                >
                                    {formatDate(family.date_of_birth)}
                                </td>
                                <td
                                className={classNames(
                                    familyIdx !== family.length - 1 ? 'border-b border-gray-200' : '',
                                    'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                                )}
                                >
                                    {Math.floor(
                                    (new Date() - new Date(family.date_of_birth)) /
                                        (365.25 * 24 * 60 * 60 * 1000)
                                    )}
                                </td>
                                <td
                                className={classNames(
                                    familyIdx !== family.length - 1 ? 'border-b border-gray-200' : '',
                                    'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                                )}
                                >
                                {family.gender}
                                </td>
                                <td
                                className={classNames(
                                    familyIdx !== family.length - 1 ? 'border-b border-gray-200' : '',
                                    'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                                )}
                                >
                                {family.father_name || 'NA'}
                                </td>
                                <td
                                className={classNames(
                                    familyIdx !== family.length - 1 ? 'border-b border-gray-200' : '',
                                    'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                                )}
                                >
                                {family.mother_name || 'NA'}
                                </td>
                                <td
                                className={classNames(
                                    familyIdx !== family.length - 1 ? 'border-b border-gray-200' : '',
                                    'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                                )}
                                >
                                {family.household_no}
                                </td>
                                <td
                                className={classNames(
                                    familyIdx !== family.length - 1 ? 'border-b border-gray-200' : '',
                                    'whitespace-pre-line px-3 py-1 text-sm text-gray-500'
                                )}
                                >
                                {`${family.households.villages.name}\n${family.households.ward_village_tracts.name}\n${family.households.townships.name}, ${family.households.districts.name},${family.households.state_regions.name}`}
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                   
                    {/* Pagination */}
                    <nav className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6" aria-label="Pagination">
                        <div className="hidden sm:block">
                        <p className="text-sm text-gray-700">
                            {t("other.Showing")} <span className="font-medium">{offset + 1}</span> {t("other.To")}{' '}
                            <span className="font-medium">{offset + currentPageData.length}</span> {t("other.Of")}{' '}
                            <span className="font-medium">{filterFamilies.length}</span> {t("other.Results")}
                        </p>
                        </div>
                        <div className="flex justify-between flex-1 sm:justify-end">
                        <button
                            onClick={goToPreviousPage}
                            className="relative inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
                            disabled={currentPage === 0}
                        >
                            <ChevronLeftIcon className="w-4 h-4 mr-1" />
                            {t("other.Previous")}
                        </button>
                        <button
                            onClick={goToNextPage}
                            className="relative inline-flex items-center px-3 py-2 ml-3 text-sm font-semibold text-gray-900 bg-white rounded-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
                            disabled={currentPage === Math.ceil(filterFamilies.length / perPage) - 1}
                        >
                            {t("other.Next")}
                            <ChevronRightIcon className="w-4 h-4 ml-1" />
                        </button>
                        </div>
                    </nav>
                </div>
            </div>
            <div className="flex items-center mt-4">
                <button
                    onClick={handlePrint}
                    className="px-4 py-2 mr-2 text-white bg-blue-900 rounded-md"
                >
                    Print
                </button>
                <button
                    onClick={handleSaveAsPdf}
                    className="px-4 py-2 text-white bg-blue-500 rounded-md"
                >
                    Save as PDF
                </button>
            </div>

        {/* Hidden component for printing */}
        {/* <div style={{ display: 'none' }}>
            <ComponentToPrint ref={componentRef} data={filterFamilies} totalResults={filterFamilies.length} />
        </div> */}
    </div>
    );
};

// const ComponentToPrint = React.forwardRef(({ data, totalResults }, ref) => (
//     <div ref={ref}>
//       <h2>Total Results: {totalResults}</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Age</th>
//             <th>School</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((item) => (
//             <tr key={item.id}>
//               <td>{item.name}</td>
//               <td>{item.age}</td>
//               <td>{item.school}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
// ));

export default Report;