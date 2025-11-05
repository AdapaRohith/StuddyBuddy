


const DOMElements = {}; 
const eventListeners = new Map(); 
let rafId = null; 


document.addEventListener('DOMContentLoaded', function() {
    performance.mark('app-init-start');
    
    
    cacheDOMElements();
    
    
    requestAnimationFrame(() => {
        
        initAuthentication();
        initNavigation();
        initMobileNav();
        
        
        requestAnimationFrame(() => {
            initInteractiveElements();
            initTaskManagement();
            initGroupInteractions();
            
            
            requestAnimationFrame(() => {
                initConditionalFeatures();
                performance.mark('app-init-end');
                performance.measure('app-init', 'app-init-start', 'app-init-end');
            });
        });
    });
});


function cacheDOMElements() {
    const selectors = {
        uploadBtn: '#uploadBtn',
        createScheduleBtn: '#createScheduleBtn', 
        editProfileBtn: '#editProfileBtn',
        createGroupBtn: '#createGroupBtn',
        navLinks: '.nav-link',
        navToggle: '#navToggle',
        mainNav: '.main-nav'
    };
    
    Object.entries(selectors).forEach(([key, selector]) => {
        if (selector.startsWith('.')) {
            DOMElements[key] = document.querySelectorAll(selector);
        } else {
            DOMElements[key] = document.querySelector(selector);
        }
    });
}


function initConditionalFeatures() {
    if (DOMElements.uploadBtn) {
        console.log('Upload button found, initializing upload modal...');
        initUploadModal();
    }
    
    if (DOMElements.createScheduleBtn) {
        console.log('Schedule button found, initializing schedule modal...');
        initScheduleModal();
    }
    
    if (DOMElements.editProfileBtn) {
        console.log('Edit profile button found, initializing profile modal...');
        initProfileModal();
    }
    
    if (DOMElements.createGroupBtn) {
        initDynamicGroupCreation();
    }
}


function initNavigation() {
    const navLinks = DOMElements.navLinks || document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        
        if (href === currentPage) {
            link.classList.add('active');
        }
        
        
        const clickHandler = function(e) {
            e.preventDefault();
            
            
            if (this.dataset.navigating === 'true') return;
            this.dataset.navigating = 'true';
            
            
            this.classList.add('loading');
            
            
            requestAnimationFrame(() => {
                const spanText = this.querySelector('span')?.textContent || 'page';
                showNotification(`Navigating to ${spanText}...`, 'info');
                
                
                const timeoutId = setTimeout(() => {
                    window.location.href = href;
                }, 300);
                
                eventListeners.set(this, timeoutId);
            });
        };
        
        
        let hoverRAF = null;
        const mouseEnterHandler = function() {
            if (hoverRAF) cancelAnimationFrame(hoverRAF);
            hoverRAF = requestAnimationFrame(() => {
                this.style.transform = 'translateY(-2px)';
            });
        };
        
        const mouseLeaveHandler = function() {
            if (hoverRAF) cancelAnimationFrame(hoverRAF);
            hoverRAF = requestAnimationFrame(() => {
                this.style.transform = 'translateY(0)';
            });
        };
        
        
        link.addEventListener('click', clickHandler);
        link.addEventListener('mouseenter', mouseEnterHandler, { passive: true });
        link.addEventListener('mouseleave', mouseLeaveHandler, { passive: true });
    });
}


function initInteractiveElements() {
    
    const elements = {
        videoCallBtn: '.btn-video-call',
        audioCallBtn: '.btn-audio-call',
        headerIcons: '.header-icons i',
        resourceItems: '.resource-item'
    };
    
    
    document.addEventListener('click', handleElementClicks, { passive: false });
    
    
    requestAnimationFrame(() => {
        animateProgressCircles();
        initRippleEffects();
    });
}


function handleElementClicks(e) {
    const target = e.target.closest('.btn-video-call, .btn-audio-call, .header-icons i, .resource-item');
    if (!target) return;
    
    
    if (target.dataset.processing === 'true') return;
    target.dataset.processing = 'true';
    
    requestAnimationFrame(() => {
        if (target.matches('.btn-video-call')) {
            target.classList.add('clicked');
            initializeVideoCall();
        } else if (target.matches('.btn-audio-call')) {
            target.classList.add('clicked');
            initializeAudioCall();
        } else if (target.matches('.header-icons i')) {
            handleHeaderIconClick(target);
        } else if (target.matches('.resource-item')) {
            handleResourceItemClick(target);
        }
        
        
        setTimeout(() => {
            target.dataset.processing = 'false';
        }, 100);
    });
}


function handleHeaderIconClick(icon) {
    const iconClass = icon.className;
    
    if (iconClass.includes('bell')) {
        showNotification('You have 3 new notifications', 'info');
        icon.classList.add('bounce');
        setTimeout(() => icon.classList.remove('bounce'), 600);
    } else if (iconClass.includes('heart')) {
        showNotification('Added to favorites!', 'success');
        icon.classList.toggle('fa-regular');
        icon.classList.toggle('fa-solid');
        icon.style.color = icon.classList.contains('fa-solid') ? '#ff6b6b' : '';
    } else if (iconClass.includes('bars')) {
        toggleMobileNav();
    }
}


function handleResourceItemClick(item) {
    const fileName = item.querySelector('.file-name')?.textContent || 'file';
    showNotification(`Opening ${fileName}...`, 'info');
    item.classList.add('selected');
    
    setTimeout(() => {
        item.classList.remove('selected');
    }, 1000);
}


function initRippleEffects() {
    const rippleElements = document.querySelectorAll('.btn, .card, .nav-link');
    
    rippleElements.forEach(element => {
        element.addEventListener('mousedown', createRippleEffect, { passive: true });
    });
}


function createRippleEffect(e) {
    if (this.querySelector('.ripple')) return; 
    
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    `;
    ripple.classList.add('ripple');
    
    this.style.position = this.style.position || 'relative';
    this.appendChild(ripple);
    
    
    setTimeout(() => ripple.remove(), 600);
}


function initMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', toggleMobileNav);
        
        
        document.addEventListener('click', function(e) {
            if (!mainNav.contains(e.target) && mainNav.classList.contains('active')) {
                toggleMobileNav();
            }
        });
    }
}

function toggleMobileNav() {
    const mainNav = document.querySelector('.main-nav');
    const navToggle = document.getElementById('navToggle');
    
    if (mainNav && navToggle) {
        mainNav.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        
        const icon = navToggle.querySelector('i');
        if (mainNav.classList.contains('active')) {
            icon.classList.replace('fa-bars', 'fa-times');
        } else {
            icon.classList.replace('fa-times', 'fa-bars');
        }
    }
}


function initTaskManagement() {
    const taskContainer = document.querySelector('.task-list') || document.querySelector('.tasks-container');
    if (!taskContainer) return;
    
    
    taskContainer.addEventListener('change', handleTaskCheckbox, { passive: true });
    taskContainer.addEventListener('click', handleTaskButtons, { passive: true });
    
    
    initAddTaskFeature();
}


function handleTaskCheckbox(e) {
    if (!e.target.matches('input[type="checkbox"]')) return;
    
    const checkbox = e.target;
    const item = checkbox.closest('.task-item');
    const label = item.querySelector('label');
    const taskText = label?.textContent || 'Task';
    
    
    requestAnimationFrame(() => {
        if (checkbox.checked) {
            item.classList.add('completed');
            showNotification(`Task completed: ${taskText}`, 'success');
        } else {
            item.classList.remove('completed');
            showNotification(`Task reopened: ${taskText}`, 'info');
        }
    });
}


function handleTaskButtons(e) {
    if (!e.target.matches('.close-btn')) return;
    
    const closeBtn = e.target;
    const item = closeBtn.closest('.task-item');
    const label = item.querySelector('label');
    const taskText = label?.textContent || 'Task';
    
    
    requestAnimationFrame(() => {
        item.style.cssText = 'transform: translateX(100%); opacity: 0; transition: all 0.3s ease;';
        
        setTimeout(() => {
            item.remove();
            showNotification(`Task removed: ${taskText}`, 'warning');
        }, 300);
    });
}


function setupTaskItem(item) {
    
    
}


function initAddTaskFeature() {
    
    const elements = {
        addTaskBtn: document.getElementById('addTaskBtn'),
        addTaskForm: document.getElementById('addTaskForm'),
        taskInput: document.getElementById('taskInput'),
        saveTaskBtn: document.getElementById('saveTaskBtn'),
        cancelTaskBtn: document.getElementById('cancelTaskBtn'),
        taskList: document.querySelector('.task-list')
    };
    
    if (!elements.addTaskBtn || !elements.taskList) return;
    
    let taskIdCounter = 4; 
    
    
    elements.addTaskBtn.addEventListener('click', showAddTaskForm, { passive: true });
    if (elements.cancelTaskBtn) elements.cancelTaskBtn.addEventListener('click', hideAddTaskForm, { passive: true });
    if (elements.saveTaskBtn) elements.saveTaskBtn.addEventListener('click', addNewTask, { passive: true });
    
    
    if (elements.taskInput) {
        elements.taskInput.addEventListener('keydown', handleTaskInputKeys, { passive: false });
    }
    
    
    let outsideClickTimeout = null;
    document.addEventListener('click', (e) => {
        if (outsideClickTimeout) clearTimeout(outsideClickTimeout);
        outsideClickTimeout = setTimeout(() => {
            if (elements.addTaskForm?.style.display === 'block' && 
                !elements.addTaskForm.contains(e.target) && 
                !elements.addTaskBtn.contains(e.target)) {
                hideAddTaskForm();
            }
        }, 10);
    }, { passive: true });
    
    function showAddTaskForm() {
        requestAnimationFrame(() => {
            elements.addTaskBtn.style.display = 'none';
            if (elements.addTaskForm) {
                elements.addTaskForm.style.display = 'block';
                elements.taskInput?.focus();
            }
        });
    }
    
    function hideAddTaskForm() {
        requestAnimationFrame(() => {
            if (elements.addTaskForm) elements.addTaskForm.style.display = 'none';
            elements.addTaskBtn.style.display = 'flex';
            if (elements.taskInput) elements.taskInput.value = '';
        });
    }
    
    function handleTaskInputKeys(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addNewTask();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            hideAddTaskForm();
        }
    }
    
    function addNewTask() {
        const taskText = elements.taskInput?.value.trim();
        
        if (!taskText) {
            showNotification('Please enter a task description', 'warning');
            elements.taskInput?.focus();
            return;
        }
        
        if (taskText.length > 100) {
            showNotification('Task description is too long (max 100 characters)', 'warning');
            return;
        }
        
        
        const fragment = document.createDocumentFragment();
        const newTaskId = `task${taskIdCounter++}`;
        const newTaskItem = document.createElement('li');
        newTaskItem.className = 'task-item';
        newTaskItem.style.cssText = 'opacity: 0; transform: translateY(-20px); transition: all 0.3s ease;';
        
        newTaskItem.innerHTML = `
            <input type="checkbox" id="${newTaskId}">
            <label for="${newTaskId}">${taskText}</label>
            <button class="close-btn">&times;</button>
        `;
        
        fragment.appendChild(newTaskItem);
        elements.taskList.appendChild(fragment);
        
        
        requestAnimationFrame(() => {
            newTaskItem.style.cssText = 'opacity: 1; transform: translateY(0); transition: all 0.3s ease;';
        });
        
        
        if (elements.taskInput) elements.taskInput.value = '';
        hideAddTaskForm();
        
        showNotification(`Task added: ${taskText}`, 'success');
    }
}


function initGroupInteractions() {
    const groupContainer = document.querySelector('.groups-container') || document.querySelector('.dashboard-groups') || document.body;
    
    
    initializeMembershipData();
    
    
    groupContainer.addEventListener('click', handleGroupClicks, { passive: false });
    
    
    requestAnimationFrame(() => {
        const groupCards = document.querySelectorAll('.group-card');
        groupCards.forEach(card => {
            const groupId = card.dataset.groupId || card.getAttribute('data-group-id');
            refreshJoinButton(groupId, card);
        });
    });
}


function handleGroupClicks(e) {
    const joinBtn = e.target.closest('.btn-join');
    const card = e.target.closest('.group-card');
    
    if (joinBtn && card) {
        e.stopPropagation();
        const groupId = card.dataset.groupId || card.getAttribute('data-group-id');
        toggleMembership(groupId, card);
        return;
    }
    
    if (card && !e.target.closest('.btn-group-action, .btn-join, .btn-action')) {
        const groupId = card.dataset.groupId || card.getAttribute('data-group-id');
        const isMemberOfGroup = isMember(groupId);
        
        try {
            openGroupModal(groupId, card, isMemberOfGroup);
        } catch (error) {
            console.error('Error in group click handler:', error);
            showNotification('Error opening group. Please try again.', 'error');
        }
    }
}


function initializeMembershipData() {
    const currentMap = getMemberships();
    if (Object.keys(currentMap).length === 0) {
        const groupCards = document.querySelectorAll('.group-card');
        groupCards.forEach(card => {
            const gid = card.dataset.groupId || card.getAttribute('data-group-id');
            const btn = card.querySelector('.btn-join');
            if (btn?.classList.contains('active')) {
                setMembership(gid, true);
            }
        });
    }
}


function getMemberships() {
    try {
        const raw = localStorage.getItem('studybuddy_members');
        return raw ? JSON.parse(raw) : {};
    } catch (e) {
        return {};
    }
}

function isMember(groupId) {
    const map = getMemberships();
    return !!map[groupId];
}

function setMembership(groupId, value) {
    const map = getMemberships();
    if (value) map[groupId] = true; else delete map[groupId];
    localStorage.setItem('studybuddy_members', JSON.stringify(map));
}


function toggleMembership(groupId, card) {
    const currentlyMember = isMember(groupId);
    
    
    requestAnimationFrame(() => {
        if (currentlyMember) {
            setMembership(groupId, false);
            showNotification('You left the group', 'info');
        } else {
            setMembership(groupId, true);
            showNotification('You joined the group', 'success');
        }
        refreshJoinButton(groupId, card);
    });
}


function refreshJoinButton(groupId, card) {
    const joinBtn = card.querySelector('.btn-join');
    if (!joinBtn) return;
    
    const role = card.getAttribute('data-user-role') || 'guest';
    const memberStatus = isMember(groupId);
    
    
    if (memberStatus) {
        joinBtn.classList.add('active');
        joinBtn.textContent = role === 'admin' ? 'Admin' : 'Member';
    } else {
        joinBtn.classList.remove('active');
        const action = joinBtn.dataset.action || 'join';
        joinBtn.textContent = action === 'join' ? 'Join' : (action === 'accept' ? 'Accept Invite' : 'Join');
    }
}


function openGroupModal(groupId, card, isMember = true) {
    try {
        
        const existing = document.getElementById('groupDetailsModal');
        if (existing) existing.remove();

        const name = card.querySelector('.group-info h3')?.innerText || 'Unknown Group';
        const desc = card.querySelector('.group-description')?.innerText || 'No description available';
        const stats = Array.from(card.querySelectorAll('.group-stats span')).map(s => s.innerText).join(' • ');

    
    let memberSection = '';
    let actionButtons = '';

    if (isMember) {
        
        memberSection = `
            <div class="modal-members">
                <h4><i class="fa-solid fa-users"></i> Members</h4>
                <ul class="member-list">
                    <li><i class="fa-solid fa-user"></i> You (member)</li>
                    <li><i class="fa-solid fa-user"></i> Alex Johnson</li>
                    <li><i class="fa-solid fa-user"></i> Sarah Chen</li>
                    <li><i class="fa-solid fa-user"></i> Mike Rodriguez</li>
                    <li><i class="fa-solid fa-users"></i> + ${Math.floor(Math.random() * 20) + 5} more...</li>
                </ul>
            </div>`;
        
        actionButtons = `
            <button class="btn btn-download">
                <i class="fa-solid fa-download"></i> Download Files
            </button>
            <button class="btn btn-invite-member">
                <i class="fa-solid fa-user-plus"></i> Invite Member
            </button>
            <button class="btn btn-leave danger">
                <i class="fa-solid fa-sign-out-alt"></i> Leave Group
            </button>`;
    } else {
        
        memberSection = `
            <div class="modal-members">
                <h4><i class="fa-solid fa-users"></i> Members (${Math.floor(Math.random() * 50) + 10})</h4>
                <p class="visitor-note">
                    <i class="fa-solid fa-info-circle"></i>
                    You're viewing as a visitor. Join this group to access downloads and participate in discussions.
                </p>
                <ul class="member-list preview">
                    <li><i class="fa-solid fa-crown"></i> Alex Johnson (admin)</li>
                    <li><i class="fa-solid fa-user"></i> Sarah Chen</li>
                    <li><i class="fa-solid fa-user"></i> Mike Rodriguez</li>
                    <li><i class="fa-solid fa-users"></i> + many more members...</li>
                </ul>
            </div>
            <div class="member-actions-locked">
                <h4><i class="fa-solid fa-lock"></i> Member-Only Features</h4>
                <div class="locked-features">
                    <div class="locked-feature">
                        <i class="fa-solid fa-download"></i>
                        <span>Download Files & Resources</span>
                        <small>Members only</small>
                    </div>
                    <div class="locked-feature">
                        <i class="fa-solid fa-calendar"></i>
                        <span>Study Sessions & Events</span>
                        <small>Join to attend</small>
                    </div>
                </div>
            </div>`;
        
        actionButtons = `
            <button class="btn btn-join-now primary">
                <i class="fa-solid fa-user-plus"></i> Join Group
            </button>
            <button class="btn btn-browse-only">
                <i class="fa-solid fa-eye"></i> Continue Browsing
            </button>`;
    }

    const modal = document.createElement('div');
    modal.id = 'groupDetailsModal';
    modal.className = 'group-modal-overlay';
    modal.innerHTML = `
        <div class="group-modal">
            <div class="group-modal-header">
                <h2>${escapeHtml(name)} ${!isMember ? '<span class="visitor-badge">👁️ Viewing as Guest</span>' : ''}</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="group-modal-body">
                <p class="modal-desc">${escapeHtml(desc)}</p>
                <div class="modal-stats">${escapeHtml(stats)}</div>
                ${memberSection}
                <div class="modal-actions">
                    ${actionButtons}
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());

    
    if (isMember) {
        modal.querySelector('.btn-leave').addEventListener('click', () => {
            setMembership(groupId, false);
            refreshJoinButton(groupId, card);
            showNotification('You left the group', 'info');
            modal.remove();
        });

        const downloadBtn = modal.querySelector('.btn-download');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                showNotification('Accessing group files and resources...', 'info');
                
            });
        }

        const inviteBtn = modal.querySelector('.btn-invite-member');
        if (inviteBtn) {
            inviteBtn.addEventListener('click', () => {
                showNotification('Invite feature coming soon!', 'info');
            });
        }
    } else {
        
        const joinBtn = modal.querySelector('.btn-join-now');
        if (joinBtn) {
            joinBtn.addEventListener('click', () => {
                setMembership(groupId, true);
                refreshJoinButton(groupId, card);
                showNotification('You joined the group!', 'success');
                modal.remove();
                
                setTimeout(() => openGroupModal(groupId, card, true), 300);
            });
        }

        const browseBtn = modal.querySelector('.btn-browse-only');
        if (browseBtn) {
            browseBtn.addEventListener('click', () => {
                showNotification('Continuing as visitor. Join to unlock all features!', 'info');
                modal.remove();
            });
        }
    }
    
    } catch (error) {
        console.error('Error in openGroupModal:', error);
        showNotification('Error opening group details. Please try again.', 'error');
    }
}


function escapeHtml(str) {
    return String(str)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}




function addRippleEffect(element) {
    
    element.addEventListener('mousedown', createRippleEffect, { passive: true });
}


function showNotification(message, type = 'info') {
    
    const existingNotifications = document.querySelectorAll('.notification');
    if (existingNotifications.length >= 3) {
        existingNotifications[0].remove();
    }
    
    const fragment = document.createDocumentFragment();
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fa-solid ${getNotificationIcon(type)}"></i>
        <span>${escapeHtml(message)}</span>
        <button class="notification-close">&times;</button>
    `;
    
    
    notification.addEventListener('click', (e) => {
        if (e.target.matches('.notification-close')) {
            hideNotification(notification);
        }
    }, { passive: true });
    
    fragment.appendChild(notification);
    document.body.appendChild(fragment);
    
    
    requestAnimationFrame(() => {
        notification.classList.add('show');
        
        
        setTimeout(() => {
            if (notification.parentNode) {
                hideNotification(notification);
            }
        }, 3000);
    });
}

function hideNotification(notification) {
    notification.classList.add('hide');
    setTimeout(() => notification.remove(), 300);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-triangle',
        warning: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}


function animateProgressCircles() {
    const progressCircles = document.querySelectorAll('.progress-circle');
    if (progressCircles.length === 0) return;
    
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const circle = entry.target;
                const progress = getComputedStyle(circle).getPropertyValue('--progress');
                
                requestAnimationFrame(() => {
                    circle.style.setProperty('--progress', '0');
                    
                    requestAnimationFrame(() => {
                        circle.style.setProperty('--progress', progress);
                    });
                });
                
                observer.unobserve(circle);
            }
        });
    }, { threshold: 0.1 });
    
    progressCircles.forEach(circle => observer.observe(circle));
}


function updateGroupDashboard(groupName) {
    const mainContent = document.querySelector('.main-content h2');
    if (mainContent) {
        mainContent.textContent = `${groupName} Dashboard`;
        
        
        mainContent.classList.add('loading');
        setTimeout(() => {
            mainContent.classList.remove('loading');
        }, 1000);
    }
}


let keyboardThrottle = null;
document.addEventListener('keydown', function(e) {
    if (keyboardThrottle) return;
    
    keyboardThrottle = setTimeout(() => {
        keyboardThrottle = null;
    }, 100);
    
    
    if (e.altKey && e.key === 'n') {
        e.preventDefault();
        const bellIcon = document.querySelector('.fa-bell');
        if (bellIcon) bellIcon.click();
    }
    
    
    if (e.altKey && e.key === 'v') {
        e.preventDefault();
        const videoBtn = document.querySelector('.btn-video-call');
        if (videoBtn) videoBtn.click();
    }
}, { passive: false });


let resizeTimeout = null;
window.addEventListener('resize', function() {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    
    resizeTimeout = setTimeout(() => {
        
        if (window.innerWidth > 992) {
            const mainNav = document.querySelector('.main-nav');
            if (mainNav?.classList.contains('active')) {
                toggleMobileNav();
            }
        }
    }, 150);
}, { passive: true });


function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src], img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px 0px'
        });
        
        images.forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
    } else {
        
        images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
            img.classList.add('loaded');
        });
    }
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLazyLoading);
} else {
    initLazyLoading();
}






function initDynamicGroupCreation() {
    console.log('🎯 Initializing dynamic group creation...');
    
    
    const elements = {
        createBtn: document.getElementById('createGroupBtn'),
        overlay: document.getElementById('groupFormOverlay'),
        closeBtn: document.getElementById('closeFormBtn'),
        cancelBtn: document.getElementById('cancelFormBtn'),
        form: document.getElementById('groupCreationForm')
    };
    
    if (!elements.createBtn || !elements.overlay || !elements.form) {
        console.log('❌ Group creation elements not found');
        return;
    }
    
    
    elements.createBtn.addEventListener('click', () => {
        console.log('📝 Opening group creation form...');
        requestAnimationFrame(() => {
            elements.overlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            
            setTimeout(() => {
                const firstInput = document.getElementById('groupName');
                if (firstInput) firstInput.focus();
            }, 100);
        });
    }, { passive: true });
    
    
    const closeForm = () => {
        console.log('❌ Closing group creation form...');
        requestAnimationFrame(() => {
            elements.overlay.style.display = 'none';
            document.body.style.overflow = 'auto';
            elements.form.reset();
            
            
            const inputs = elements.form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.classList.remove('invalid', 'valid');
            });
        });
    };
    
    
    if (elements.closeBtn) elements.closeBtn.addEventListener('click', closeForm, { passive: true });
    if (elements.cancelBtn) elements.cancelBtn.addEventListener('click', closeForm, { passive: true });
    
    
    elements.overlay.addEventListener('click', (e) => {
        if (e.target === elements.overlay) {
            requestAnimationFrame(closeForm);
        }
    }, { passive: true });
    
    
    elements.form.addEventListener('submit', handleGroupCreation, { passive: false });
    
    
    const inputs = elements.form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField, { passive: true });
        input.addEventListener('input', debounce(clearValidationError, 200), { passive: true });
    });
}


function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}


function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    
    field.classList.remove('invalid', 'valid');
    
    let isValid = true;
    let errorMessage = '';
    
    
    const validationRules = {
        'groupName': {
            minLength: 3,
            maxLength: 50,
            messages: {
                min: 'Group name must be at least 3 characters',
                max: 'Group name must be less than 50 characters'
            }
        },
        'groupDescription': {
            minLength: 10,
            maxLength: 200,
            messages: {
                min: 'Description must be at least 10 characters',
                max: 'Description must be less than 200 characters'
            }
        },
        'groupCategory': {
            required: true,
            message: 'Please select a category'
        },
        'groupPrivacy': {
            required: true,
            message: 'Please select privacy setting'
        }
    };
    
    const rules = validationRules[field.id];
    if (!rules) return true;
    
    if (rules.required && !value) {
        isValid = false;
        errorMessage = rules.message;
    } else if (rules.minLength && value.length < rules.minLength) {
        isValid = false;
        errorMessage = rules.messages.min;
    } else if (rules.maxLength && value.length > rules.maxLength) {
        isValid = false;
        errorMessage = rules.messages.max;
    }
    
    
    requestAnimationFrame(() => {
        if (isValid) {
            field.classList.add('valid');
        } else {
            field.classList.add('invalid');
            showFieldError(field, errorMessage);
        }
    });
    
    return isValid;
}


function clearValidationError(e) {
    const field = e.target;
    
    requestAnimationFrame(() => {
        field.classList.remove('invalid');
        
        
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    });
}

function showFieldError(field, message) {
    
    const fragment = document.createDocumentFragment();
    
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    
    fragment.appendChild(errorElement);
    field.parentNode.appendChild(fragment);
}


function handleGroupCreation(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    
    const fields = Array.from(form.querySelectorAll('input, textarea, select'));
    let isFormValid = true;
    
    
    const validationPromises = fields.map(field => {
        const fieldValid = validateField({ target: field });
        if (!fieldValid) isFormValid = false;
        return fieldValid;
    });
    
    if (!isFormValid) {
        showNotification('Please fix the errors in the form', 'error');
        return;
    }
    
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    requestAnimationFrame(() => {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating...';
        submitBtn.classList.add('loading');
    });
    
    
    setTimeout(() => {
        try {
            const groupData = {
                name: formData.get('groupName'),
                description: formData.get('groupDescription'),
                category: formData.get('groupCategory'),
                privacy: formData.get('groupPrivacy'),
                id: 'group_' + Date.now()
            };
            
            console.log('📊 Creating group:', groupData);
            
            
            addGroupToPage(groupData);
            
            
            requestAnimationFrame(() => {
                document.getElementById('groupFormOverlay').style.display = 'none';
                document.body.style.overflow = 'auto';
                form.reset();
                
                
                fields.forEach(field => {
                    field.classList.remove('invalid', 'valid');
                });
            });
            
            showNotification(`Group "${groupData.name}" created successfully!`, 'success');
            
        } catch (error) {
            console.error('❌ Error creating group:', error);
            showNotification('Failed to create group. Please try again.', 'error');
        } finally {
            requestAnimationFrame(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                submitBtn.classList.remove('loading');
            });
        }
    }, 1500); 
}


function addGroupToPage(groupData) {
    const groupsContainer = document.querySelector('.groups-grid') || document.querySelector('.group-cards');
    
    if (!groupsContainer) {
        console.log('No groups container found');
        return;
    }
    
    
    const fragment = document.createDocumentFragment();
    const groupCard = document.createElement('div');
    groupCard.className = 'group-card';
    groupCard.dataset.groupId = groupData.id;
    groupCard.style.cssText = 'transform: scale(0.9); opacity: 0; transition: all 0.3s ease;';
    
    const privacyIcon = groupData.privacy === 'private' ? 'fa-lock' : 'fa-globe';
    const categoryIcon = getCategoryIcon(groupData.category);
    
    groupCard.innerHTML = `
        <div class="group-header">
            <div class="group-info">
                <h3><i class="fa-solid ${categoryIcon}"></i> ${escapeHtml(groupData.name)}</h3>
                <span class="privacy-indicator">
                    <i class="fa-solid ${privacyIcon}"></i> ${groupData.privacy}
                </span>
            </div>
            <div class="group-actions">
                <button class="btn-group-action" title="More options">
                    <i class="fa-solid fa-ellipsis-v"></i>
                </button>
            </div>
        </div>
        <div class="group-content">
            <p class="group-description">${escapeHtml(groupData.description)}</p>
            <div class="group-stats">
                <span><i class="fa-solid fa-user"></i> 1 member</span>
                <span><i class="fa-solid fa-tag"></i> ${groupData.category}</span>
                <span><i class="fa-solid fa-calendar"></i> Just now</span>
            </div>
        </div>
        <div class="group-footer">
            <button class="btn btn-join active" data-action="admin">Admin</button>
        </div>
    `;
    
    fragment.appendChild(groupCard);
    
    
    if (groupsContainer.firstChild) {
        groupsContainer.insertBefore(fragment, groupsContainer.firstChild);
    } else {
        groupsContainer.appendChild(fragment);
    }
    
    
    setMembership(groupData.id, true);
    
    
    initGroupCardInteractions(groupCard);
    
    
    requestAnimationFrame(() => {
        groupCard.style.cssText = 'transform: scale(1); opacity: 1; transition: all 0.3s ease;';
    });
}

function getCategoryIcon(category) {
    const icons = {
        'study-group': 'fa-book',
        'project-team': 'fa-code',
        'research': 'fa-search',
        'tutoring': 'fa-chalkboard-teacher',
        'exam-prep': 'fa-clipboard-list',
        'homework-help': 'fa-hands-helping',
        'discussion': 'fa-comments',
        'other': 'fa-users'
    };
    return icons[category] || icons.other;
}


function initGroupCardInteractions(card) {
    const groupId = card.dataset.groupId;
    
    
    
    
    
    addRippleEffect(card);
}


function initializeAuth() {
    console.log('🔐 Authentication system initialized');
}

function initResourceDownloads() {
    console.log('📥 Resource downloads initialized');
}

function initUploadModal() {
    console.log('📤 Upload modal initialized');
}

function initScheduleModal() {
    console.log('📅 Schedule modal initialized');
}

function initProfileModal() {
    console.log('👤 Profile modal initialized');
}

function initializeVideoCall() {
    showNotification('Video call feature coming soon!', 'info');
}

function initializeAudioCall() {
    showNotification('Audio call feature coming soon!', 'info');
}
